import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  } else {
    console.warn('Authentication required. Redirecting to login.');

    if (state.url.startsWith('/admin')) {
      return router.parseUrl('/admin/login');
    } else {
      return router.parseUrl('/login');
    }
  }
};
