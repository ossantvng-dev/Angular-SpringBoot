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
          this.authService.saveTokens(response.accessToken, response.refreshToken);
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
  // LOGOUT EFFECT SIDE EFFECT
  // =========================
  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.logout),
        tap(() => {
          this.authService.clearTokens();
          this.alert.success('Session closed successfully');
          this.router.navigate(['/login']);
        }),
      ),
    { dispatch: false },
  );
}
