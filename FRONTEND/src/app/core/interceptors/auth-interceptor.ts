import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  // Définir les chemins d'API publics qui ne nécessitent pas de token
  const publicApiPaths = [
    '/api/auth/login',
    '/api/auth/register',
    '/api/customer-auth/login',
    '/api/customer-auth/register',
    '/api/rooms', // GET rooms sans ID
    '/api/bookings/available-rooms',
  ];

  // Vérifier si l'URL de la requête correspond à un chemin public
  const isPublicApi = publicApiPaths.some(path => req.url.includes(path));

  // Cas spécial pour GET /api/rooms/{id} - c'est public
  const isSpecificRoomGet = req.url.startsWith('/api/rooms/') && req.method === 'GET' && req.url.split('/').length > 3;
  if (isSpecificRoomGet) {
    // If it's a GET request for a specific room, it's public.
    // No need to change isPublicApi if it is already handled by includes.
  }

  if (token && !isPublicApi) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.removeToken();

        const currentUrl = router.url;

        if (currentUrl.startsWith('/admin')) {
          router.navigate(['/admin/login']);
        } else {
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};
