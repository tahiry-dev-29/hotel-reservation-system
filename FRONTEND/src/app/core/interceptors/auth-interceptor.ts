import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';
import { CustomerAuthService } from '../services/customer-auth-service';
import { environment } from '../../../environments/environments';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const customerAuthService = inject(CustomerAuthService);
  const router = inject(Router);

  // Get both staff and customer tokens
  const staffToken = authService.getToken(); 
  const customerToken = customerAuthService.getToken();

  // Paths that are ALWAYS public, regardless of method (authentication not required at all)
  const alwaysPublicPaths = [
    `${environment.apiUrl}/auth/login`,
    `${environment.apiUrl}/auth/register`,
    `${environment.apiUrl}/customer-auth/login`,
    `${environment.apiUrl}/customer-auth/register`,
    `${environment.apiUrl}/bookings/available-rooms`,
  ];

  // Check if the current request URL starts with any of the always public API paths
  const isAlwaysPublicApi = alwaysPublicPaths.some(path => req.url.startsWith(path));

  // Special case: GET requests to rooms are public for viewing
  const isRoomGetPublic = req.method === 'GET' && (
    req.url === `${environment.apiUrl}/rooms` ||
    req.url.startsWith(`${environment.apiUrl}/rooms/`)
  );

  // Determine which token to use, prioritizing staff token if both exist
  let tokenToAttach: string | null = null;
  if (staffToken) {
    tokenToAttach = staffToken;
  } else if (customerToken) {
    tokenToAttach = customerToken;
  }

  // Attach token only if it exists AND the request is NOT a public API call
  if (tokenToAttach && !isAlwaysPublicApi && !isRoomGetPublic) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${tokenToAttach}`,
        Accept: 'application/json',
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // If it's a 401, remove the correct token and redirect
        const currentUrl = router.url;

        if (currentUrl.startsWith('/admin')) {
          // If we are on an admin page, it's a staff token that's invalid
          authService.removeToken();
          router.navigate(['/admin/login']);
        } else {
          // Otherwise, it's a customer token that's invalid
          customerAuthService.removeToken();
          router.navigate(['/login']);
        }
      } else if (error.status === 403) {
        // Log the user's role on 403 error for better debugging
        const userProfile = authService.currentUserProfile();
        const customerProfile = customerAuthService.currentCustomerProfile();
        let userRole: string = 'Unknown';
        
        if (userProfile) {
          userRole = userProfile.role;
        } else if (customerProfile) {
          userRole = customerProfile.role;
        }

        console.error(
          `Authorization Error (403): Access denied for URL ${req.url}. User Role: ${userRole}.`
        );
      }
      return throwError(() => error);
    })
  );
};
