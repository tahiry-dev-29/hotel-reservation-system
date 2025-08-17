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

  const publicApiPaths = [
    `${environment.apiUrl}/auth/login`,
    `${environment.apiUrl}/auth/register`,
    `${environment.apiUrl}/customer-auth/login`, // NEW: Customer Login endpoint is public
    `${environment.apiUrl}/customer-auth/register`, // NEW: Customer Register endpoint is public
    `${environment.apiUrl}/rooms`, // Public endpoint for rooms
    `${environment.apiUrl}/rooms/`, // Specific room details
    `${environment.apiUrl}/bookings/available-rooms`, // Public for checking availability
  ];

  // Check if the current request URL starts with any of the public API paths
  const isPublicApi = publicApiPaths.some(path => req.url.startsWith(path));
  // Specifically allow GET for any room ID
  const isSpecificRoomGetPublic = req.url.match(new RegExp(`^${environment.apiUrl}/rooms/[^/]+$`)) && req.method === 'GET';


  // Attach staff token only if it exists and the request is NOT to a public API
  if (staffToken && !isPublicApi && !isSpecificRoomGetPublic) {
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
