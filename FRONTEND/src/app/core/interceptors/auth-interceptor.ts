import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { environment } from '../../../environments/environments';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // This getToken() is for staff users. We are explicitly excluding customer auth paths.
  const staffToken = authService.getToken(); 

  // Paths that are ALWAYS public, regardless of method (authentication not required at all)
  const alwaysPublicPaths = [
    `${environment.apiUrl}/auth/login`,
    `${environment.apiUrl}/auth/register`,
    `${environment.apiUrl}/customer-auth/login`, // Customer Login endpoint is public
    `${environment.apiUrl}/customer-auth/register`, // Customer Register endpoint is public
    `${environment.apiUrl}/bookings/available-rooms`, // Public for checking availability
  ];

  // Check if the current request URL starts with any of the always public API paths
  const isAlwaysPublicApi = alwaysPublicPaths.some(path => req.url.startsWith(path));

  // Special case: GET requests to /api/rooms (all rooms) or /api/rooms/{id} (single room) are public
  // This needs to be precise so other methods (POST, PUT, DELETE) on /api/rooms are not skipped.
  const isRoomGetPublic = req.method === 'GET' && (
    req.url === `${environment.apiUrl}/rooms` || // Matches exact path for all rooms
    req.url.match(new RegExp(`^${environment.apiUrl}/rooms/[^/]+$`)) // Matches /rooms/{id}
  );

  // Attach staff token only if it exists AND the request is NOT an always public API
  // AND it's NOT a public GET request for rooms.
  // This ensures that DELETE, POST, PUT requests to /api/rooms/** receive the token.
  if (staffToken && !isAlwaysPublicApi && !isRoomGetPublic) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${staffToken}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // If it's a 401, remove the staff token (if any) and redirect
        // Note: Customer tokens are handled by CustomerAuthService's logout method.
        // This interceptor primarily handles staff token invalidation.
        authService.removeToken();

        const currentUrl = router.url;
        if (currentUrl.startsWith('/admin')) {
          router.navigate(['/admin/login']);
        } else {
          // If a public page or customer page received 401, redirect to customer login
          router.navigate(['/login']); 
        }
      }
      return throwError(() => error);
    })
  );
};
