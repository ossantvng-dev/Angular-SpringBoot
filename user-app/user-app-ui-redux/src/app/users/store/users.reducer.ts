import { createReducer, on } from '@ngrx/store';

import { initialUsersState } from './users.state';

import * as UsersActions from './users.actions';

export const usersReducer = createReducer(
  initialUsersState,

  // ======================================
  // LOAD USERS
  // ======================================

  on(UsersActions.loadUsers, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.loadUsersSuccess, (state, action) => ({
    ...state,
    users: action.users,
    currentPage: action.currentPage,
    totalPages: action.totalPages,
    totalElements: action.totalElements,
    pageSize: action.pageSize,
    loading: false,
    error: null,
  })),

  on(UsersActions.loadUsersFailure, (state, action) => ({
    ...state,
    loading: false,
    error: action.error,
  })),

  // ======================================
  // CREATE USER
  // ======================================

  on(UsersActions.createUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.createUserSuccess, (state, action) => ({
    ...state,
    users: [...state.users, action.user],
    loading: false,
    error: null,
  })),

  on(UsersActions.createUserFailure, (state, action) => ({
    ...state,
    loading: false,
    error: action.error,
  })),

  // ======================================
  // UPDATE USER
  // ======================================

  on(UsersActions.updateUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.updateUserSuccess, (state, action) => ({
    ...state,
    users: state.users.map((user) => (user.id === action.user.id ? action.user : user)),
    loading: false,
    error: null,
  })),

  on(UsersActions.updateUserFailure, (state, action) => ({
    ...state,
    loading: false,
    error: action.error,
  })),

  // ======================================
  // DELETE USER
  // ======================================

  on(UsersActions.deleteUser, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(UsersActions.deleteUserSuccess, (state, action) => ({
    ...state,
    users: state.users.filter((user) => user.id !== action.id),
    loading: false,
    error: null,
  })),

  on(UsersActions.deleteUserFailure, (state, action) => ({
    ...state,
    loading: false,
    error: action.error,
  })),
);
