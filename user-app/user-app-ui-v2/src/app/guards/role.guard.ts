import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const roleGuard = (roles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);

    const router = inject(Router);

    const token = authService.getAccessToken();

    // no token o expirado
    if (!token || authService.isTokenExpired()) {
      router.navigate(['/login']);

      return false;
    }

    const userRoles = authService.getRoles();

    const hasAccess = roles.some((role) => userRoles.includes(role));

    if (hasAccess) {
      return true;
    }

    router.navigate(['/unauthorized']);

    return false;
  };
};
