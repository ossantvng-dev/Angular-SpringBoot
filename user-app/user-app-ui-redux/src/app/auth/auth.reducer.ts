import { createReducer, on } from '@ngrx/store';
import { initialAuthState } from './auth.state';
import * as AuthActions from './auth.actions';
import { jwtDecode } from 'jwt-decode';

function decode(token: string): any {
  try {
    return jwtDecode(token);
  } catch {
    return null;
  }
}

export const authReducer = createReducer(
  initialAuthState,

  on(AuthActions.login, (state) => ({
    ...state,
    loading: true,
  })),

  on(AuthActions.loginSuccess, (state, { response }) => {
    const decoded = decode(response.accessToken);

    return {
      ...state,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      username: decoded?.sub || null,
      roles: decoded?.roles || [],
      isAuthenticated: true,
      loading: false,
    };
  }),

  on(AuthActions.loginFailure, (state) => ({
    ...state,
    loading: false,
  })),

  on(AuthActions.logout, () => initialAuthState),

  on(AuthActions.refreshTokenSuccess, (state, { response }) => {
    const decoded = decode(response.accessToken);

    return {
      ...state,
      accessToken: response.accessToken,
      refreshToken: response.refreshToken,
      username: decoded?.sub || null,
      roles: decoded?.roles || [],
      isAuthenticated: true,
      loading: false,
    };
  }),
);
