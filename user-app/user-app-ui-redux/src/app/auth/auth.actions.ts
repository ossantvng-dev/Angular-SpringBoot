import { createAction, props } from '@ngrx/store';
import { LoginRequest } from '../models/auth/login-request';
import { AuthResponse } from '../models/auth/auth-response';


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

export const refreshTokenSuccess = createAction(
  '[Auth] Refresh Token Success',
  props<{ response: AuthResponse }>()
);

export const loadAuthFromStorage = createAction('[Auth] Load From Storage');