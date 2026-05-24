import { createFeatureSelector, createSelector } from '@ngrx/store';

import { UsersState } from './users.state';

// ======================================
// FEATURE SELECTOR
// ======================================
export const selectUsersState = createFeatureSelector<UsersState>('users');

// ======================================
// USERS
// ======================================
export const selectUsers = createSelector(
  selectUsersState,
  (state) => state.users,
);

// ======================================
// LOADING
// ======================================
export const selectUsersLoading = createSelector(
  selectUsersState,
  (state) => state.loading,
);

// ======================================
// ERROR
// ======================================
export const selectUsersError = createSelector(
  selectUsersState,
  (state) => state.error,
);

// ======================================
// PAGINATION
// ======================================
export const selectCurrentPage = createSelector(
  selectUsersState,
  (state) => state.currentPage,
);

export const selectTotalPages = createSelector(
  selectUsersState,
  (state) => state.totalPages,
);

export const selectTotalElements = createSelector(
  selectUsersState,
  (state) => state.totalElements,
);

export const selectPageSize = createSelector(
  selectUsersState,
  (state) => state.pageSize,
);
