import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map, take, tap } from 'rxjs';

import * as AuthSelectors from '../auth/store/auth.selectors';
import { AuthService } from '../auth/services/auth-service';


export const authGuard: CanActivateFn = () => {
  const store = inject(Store);
  const router = inject(Router);
  const authService = inject(AuthService);

  return store.select(AuthSelectors.selectAuthState).pipe(
    /*tap((state) => {
      console.log('AUTH GUARD STATE:', state);
    }),*/

    filter((state) => state.initialized),

    take(1),

    map((state) => {
      //console.log('FINAL AUTH STATE:', state);

      const token = state.accessToken;

      // token inválido o expirado
      if (!token || authService.isTokenExpired()) {
        //console.log('TOKEN EXPIRED OR INVALID');

        router.navigate(['/login']);

        return false;
      }

      //console.log('ALLOW ACCESS');

      return true;
    }),
  );
};
