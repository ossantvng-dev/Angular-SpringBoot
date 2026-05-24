import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AuthState } from './auth.state';

export const selectAuthState = createFeatureSelector<AuthState>('auth');

export const selectIsAuthenticated = createSelector(
  selectAuthState,
  (state) => state.isAuthenticated,
);

export const selectUsername = createSelector(
  selectAuthState, 
  (state) => state.username
);

export const selectRoles = createSelector(
  selectAuthState, 
  (state) => state.roles
);

export const selectAccessToken = createSelector(
  selectAuthState, 
  (state) => state.accessToken
);

export const selectRefreshToken = createSelector(
  selectAuthState, 
  (state) => state.refreshToken
);

export const selectIsAdmin = createSelector(
  selectRoles, 
  (roles) => roles.includes('ROLE_ADMIN')
);
