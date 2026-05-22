import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { map, take } from 'rxjs';

import * as AuthSelectors from '../auth/auth.selectors';

export const roleGuard = (roles: string[]): CanActivateFn => {
  return () => {
    const store = inject(Store);
    const router = inject(Router);

    return store.select(AuthSelectors.selectRoles).pipe(
      take(1),

      map((userRoles) => {
        const hasAccess = roles.some((role) => userRoles.includes(role));

        if (hasAccess) {
          return true;
        }

        router.navigate(['/unauthorized']);

        return false;
      }),
    );
  };
};
