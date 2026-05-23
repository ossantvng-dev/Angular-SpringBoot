import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import * as AuthActions from './auth.actions';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import { AuthService } from '../services/auth-service';
import { AlertService } from '../services/alert-service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private authService = inject(AuthService);
  private router = inject(Router);
  private alert = inject(AlertService);

  // =========================
  // LOGIN EFFECT (API CALL)
  // =========================
  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      switchMap(({ request }) =>
        this.authService.login(request).pipe(
          map((response) => AuthActions.loginSuccess({ response })),
          catchError((error) => of(AuthActions.loginFailure({ error }))),
        ),
      ),
    ),
  );

  // =========================
  // LOGIN SUCCESS SIDE EFFECT
  // =========================
  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(({ response }) => {
          this.alert.success('Login successful');
          localStorage.setItem('accessToken', response.accessToken);
          localStorage.setItem('refreshToken', response.refreshToken);
          this.router.navigate(['/users']);
        }),
      ),
    { dispatch: false },
  );

  // =========================
  // LOGIN FAILURE SIDE EFFECT
  // =========================
  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginFailure),
        tap(({ error }) => {
          this.alert.error(error?.error?.message || 'Invalid credentials');
        }),
      ),
    { dispatch: false },
  );

  // =========================
  // LOGOUT EFFECT
  // =========================
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),

        switchMap(() =>
          this.authService.logout().pipe(
            tap(() => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');

              this.alert.success('Session closed successfully');

              this.router.navigate(['/login']);
            }),

            catchError(() => {
              localStorage.removeItem('accessToken');
              localStorage.removeItem('refreshToken');

              this.router.navigate(['/login']);

              return of();
            }),
          ),
        ),
      ),

    { dispatch: false },
  );

  // ===================================
  // RESTORE SESSION EFFECT SIDE EFFECT
  // ===================================
  restoreSession$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.restoreSession),

      map(() => {
        const accessToken = localStorage.getItem('accessToken');

        const refreshToken = localStorage.getItem('refreshToken');

        // no hay tokens
        if (!accessToken || !refreshToken) {
          return AuthActions.logout();
        }

        // token corrupto/mal formado
        try {
          JSON.parse(atob(accessToken.split('.')[1]));
        } catch {
          return AuthActions.logout();
        }

        // token válido estructuralmente
        // aunque esté expirado, dejamos que interceptor haga refresh
        return AuthActions.restoreSessionSuccess({
          accessToken,
          refreshToken,
        });
      }),
    ),
  );
}
