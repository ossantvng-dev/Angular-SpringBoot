import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import Swal from 'sweetalert2';
import { Pagination } from '../../../shared/pagination/pagination';
import { AuthService } from '../../../auth/services/auth-service';
import { User } from '../../models/user';
import * as UsersActions from '../../store/users.actions';
import * as UsersSelectors from '../../store/users.selectors';
import * as AuthSelectors from '../../../auth/store/auth.selectors';
import { AsyncPipe } from '@angular/common';
import { Spinner } from '../../../shared/spinner/spinner';

@Component({
  selector: 'user-list-component',
  imports: [RouterModule, FormsModule, Pagination, AsyncPipe, Spinner],
  templateUrl: './user-list-component.html',
  styleUrl: './user-list-component.css',
})
export class UserListComponent implements OnInit {
  title = 'User List';

  // ======================================
  // STORE OBSERVABLES
  // ======================================

  isAdmin$: Observable<boolean>;

  users$: Observable<User[]>;

  loading$: Observable<boolean>;

  currentPage$: Observable<number>;

  totalPages$: Observable<number>;

  totalElements$: Observable<number>;

  pageSize$: Observable<number>;

  // ======================================
  // LOCAL STATE
  // ======================================

  currentPage = 0;

  pageSize = 5;

  pageSizes: number[] = [5, 10, 20];

  constructor(
    private store: Store,
    public authService: AuthService,
  ) {
    this.users$ = this.store.select(UsersSelectors.selectUsers);
    this.loading$ = this.store.select(UsersSelectors.selectUsersLoading);
    this.currentPage$ = this.store.select(UsersSelectors.selectCurrentPage);
    this.totalPages$ = this.store.select(UsersSelectors.selectTotalPages);
    this.totalElements$ = this.store.select(UsersSelectors.selectTotalElements);
    this.pageSize$ = this.store.select(UsersSelectors.selectPageSize);
    this.isAdmin$ = this.store.select(AuthSelectors.selectIsAdmin);
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  // ======================================
  // LOAD USERS
  // ======================================

  loadUsers(): void {
    this.store.dispatch(
      UsersActions.loadUsers({
        page: this.currentPage,
        size: this.pageSize,
      }),
    );
  }

  // ======================================
  // PAGINATION
  // ======================================

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadUsers();
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadUsers();
  }

  // ======================================
  // DELETE USER
  // ======================================

  onRemoveUser(userId: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'User will be permanently deleted',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(
          UsersActions.deleteUser({
            id: userId,
          }),
        );
      }
    });
  }
}
