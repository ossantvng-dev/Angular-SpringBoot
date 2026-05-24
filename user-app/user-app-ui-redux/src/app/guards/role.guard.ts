import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { filter, map, take } from 'rxjs';
import * as AuthSelectors from '../auth/store/auth.selectors';
import { AuthService } from '../auth/services/auth-service';

export const roleGuard = (roles: string[]): CanActivateFn => {
  return () => {
    const store = inject(Store);
    const router = inject(Router);
    const authService = inject(AuthService);

    return store.select(AuthSelectors.selectAuthState).pipe(
      // esperar restoreSession
      filter((state) => state.initialized),

      take(1),

      map((state) => {
        const token = state.accessToken;

        // token inválido o expirado
        if (!token || authService.isTokenExpired()) {
          router.navigate(['/login']);
          return false;
        }

        const userRoles = state.roles || [];

        const hasAccess = roles.some((role) => userRoles.includes(role));

        // autorizado
        if (hasAccess) {
          return true;
        }

        // sin permisos
        router.navigate(['/unauthorized']);

        return false;
      }),
    );
  };
};
