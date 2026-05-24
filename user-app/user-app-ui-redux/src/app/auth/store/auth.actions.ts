import { createAction, props } from '@ngrx/store';
import { LoginRequest } from '../models/login-request';
import { AuthResponse } from '../models/auth-response';

export const login = createAction(
  '[Auth] Login',
  props<{ request: LoginRequest }>()
);

export const loginSuccess = createAction(
  '[Auth] Login Success',
  props<{ response: AuthResponse }>()
);

export const loginFailure = createAction(
  '[Auth] Login Failure',
  props<{ error: any }>()
);

export const logout = createAction('[Auth] Logout');

export const logoutFailure = createAction(
  '[Auth] Logout Failure',
  props<{ error: any }>()
);

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ response: AuthResponse }>()
);

export const loadAuthFromStorage = createAction('[Auth] Load From Storage');

export const restoreSession = createAction(
  '[Auth] Restore Session'
);

export const restoreSessionSuccess = createAction(
  '[Auth] Restore Session Success',
  props<{ accessToken: string; refreshToken: string }>()
);