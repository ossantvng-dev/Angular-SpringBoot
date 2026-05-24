import { createAction, props } from '@ngrx/store';

import { User } from '../models/user';

import { CreateUserRequest } from '../models/create-user-request';

import { UpdateUserRequest } from '../models/update-user-request';

// ======================================
// LOAD USERS
// ======================================

export const loadUsers = createAction(
  '[Users] Load Users',
  props<{
    page: number;
    size: number;
  }>(),
);

export const loadUsersSuccess = createAction(
  '[Users] Load Users Success',
  props<{
    users: User[];
    currentPage: number;
    totalPages: number;
    totalElements: number;
    pageSize: number;
  }>(),
);

export const loadUsersFailure = createAction(
  '[Users] Load Users Failure',
  props<{
    error: string;
  }>(),
);

// ======================================
// CREATE USER
// ======================================

export const createUser = createAction(
  '[Users] Create User',
  props<{
    request: CreateUserRequest;
  }>(),
);

export const createUserSuccess = createAction(
  '[Users] Create User Success',
  props<{
    user: User;
  }>(),
);

export const createUserFailure = createAction(
  '[Users] Create User Failure',
  props<{
    error: string;
  }>(),
);

// ======================================
// UPDATE USER
// ======================================

export const updateUser = createAction(
  '[Users] Update User',
  props<{
    id: number;
    request: UpdateUserRequest;
  }>(),
);

export const updateUserSuccess = createAction(
  '[Users] Update User Success',
  props<{
    user: User;
  }>(),
);

export const updateUserFailure = createAction(
  '[Users] Update User Failure',
  props<{
    error: string;
  }>(),
);

// ======================================
// DELETE USER
// ======================================

export const deleteUser = createAction(
  '[Users] Delete User',
  props<{
    id: number;
  }>(),
);

export const deleteUserSuccess = createAction(
  '[Users] Delete User Success',
  props<{
    id: number;
  }>(),
);

export const deleteUserFailure = createAction(
  '[Users] Delete User Failure',
  props<{
    error: string;
  }>(),
);
