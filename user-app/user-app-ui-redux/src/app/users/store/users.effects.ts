import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, map, of, switchMap, tap } from 'rxjs';
import * as UsersActions from './users.actions';
import { UserService } from '../services/user-service';
import { AlertService } from '../../core/services/alert-service';
import { Router } from '@angular/router';

@Injectable()
export class UsersEffects {
  private actions$ = inject(Actions);

  private userService = inject(UserService);

  private alert = inject(AlertService);

  private router = inject(Router);

  // ======================================
  // LOAD USERS
  // ======================================

  loadUsers$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.loadUsers),

      switchMap(({ page, size }) =>
        this.userService.findAll(page, size).pipe(
          map((response) =>
            UsersActions.loadUsersSuccess({
              users: response.content,
              currentPage: response.pageNumber,
              totalPages: response.totalPages,
              totalElements: response.totalElements,
              pageSize: response.pageSize,
            }),
          ),

          catchError((error) =>
            of(
              UsersActions.loadUsersFailure({
                error: error.error?.message || 'Error loading users',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  // ======================================
  // CREATE USER
  // ======================================

  createUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.createUser),

      switchMap(({ request }) =>
        this.userService.create(request).pipe(
          map((user) => UsersActions.createUserSuccess({ user })),

          catchError((error) =>
            of(
              UsersActions.createUserFailure({
                error: error.error?.message || 'Error creating user',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  createUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.createUserSuccess),

        tap(() => {
          this.alert.success('User created successfully');
          this.router.navigate(['/users']);
        }),
      ),
    { dispatch: false },
  );

  // ======================================
  // UPDATE USER
  // ======================================

  updateUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.updateUser),

      switchMap(({ id, request }) =>
        this.userService.update(id, request).pipe(
          map((user) => UsersActions.updateUserSuccess({ user })),

          catchError((error) =>
            of(
              UsersActions.updateUserFailure({
                error: error.error?.message || 'Error updating user',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  updateUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.updateUserSuccess),

        tap(() => {
          this.alert.success('User updated successfully');
          this.router.navigate(['/users']);
        }),
      ),
    { dispatch: false },
  );

  // ======================================
  // DELETE USER
  // ======================================

  deleteUser$ = createEffect(() =>
    this.actions$.pipe(
      ofType(UsersActions.deleteUser),

      switchMap(({ id }) =>
        this.userService.remove(id).pipe(
          map(() => UsersActions.deleteUserSuccess({ id })),

          catchError((error) =>
            of(
              UsersActions.deleteUserFailure({
                error: error.error?.message || 'Error deleting user',
              }),
            ),
          ),
        ),
      ),
    ),
  );

  deleteUserSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(UsersActions.deleteUserSuccess),

        tap(() => {
          this.alert.success('User deleted successfully');
        }),
      ),
    { dispatch: false },
  );
}