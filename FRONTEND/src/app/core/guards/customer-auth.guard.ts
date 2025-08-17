import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { CustomerAuthService } from '../services/customer-auth-service';

export const customerAuthGuard: CanActivateFn = (route, state) => {
  const customerAuthService = inject(CustomerAuthService);
  const router = inject(Router);

  if (customerAuthService.isAuthenticated()) {
    return true;
  }

  // Redirect to the customer login page
  return router.parseUrl('/login');
};
