import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // The guard checks authentication status via the staff authentication signal
  if (authService.isAuthenticated()) {
    return true;
  } else {

    if (state.url.startsWith('/admin')) {
      return router.parseUrl('/admin/login');
    } else {
      // This branch might be hit if a public route somehow redirects here, or if
      // there's a misconfiguration. For clarity, ensure admin routes are only
      // handled by this guard.
      return router.parseUrl('/login'); // Fallback to main login if not explicitly admin
    }
  }
};
