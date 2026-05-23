import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';
import { FormsModule } from '@angular/forms';
import { Pagination } from '../pagination/pagination';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import * as AuthSelectors from '../../auth/auth.selectors';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'user-list-component',
  standalone: true,
  imports: [RouterModule, FormsModule, Pagination, AsyncPipe],
  templateUrl: './user-list-component.html',
  styleUrl: './user-list-component.css',
})
export class UserListComponent implements OnInit {
  title: string = 'User List';
  users: User[] = [];
  currentPage: number = 0;
  totalPages: number = 0;
  pageSize: number = 5;
  pageSizes: number[] = [5, 10, 20];
  totalElements: number = 0;
  isAdmin$!: Observable<boolean>;

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
    private store: Store,
  ) {}

  ngOnInit(): void {
    this.isAdmin$ = this.store.select(AuthSelectors.selectIsAdmin);
    this.loadUsers();
  }

  loadUsers(): void {
    console.log('LOAD USERS START');

    this.userService.findAll(this.currentPage, this.pageSize).subscribe({
      next: (response) => {
        console.log('USERS RESPONSE', response);

        this.users = [...response.content];

        this.totalPages = response.totalPages;
        this.totalElements = response.totalElements;

        this.cdr.markForCheck();
      },

      error: (error) => {
        console.log('USERS ERROR', error);
      },
    });
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  changePageSize(size: number): void {
    this.pageSize = size;
    this.currentPage = 0;
    this.loadUsers();
  }

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
        this.userService.remove(userId).subscribe(() => {
          this.loadUsers();
          //this.cdr.detectChanges();
        });
      }
    });
  }

  getStartIndex(): number {
    return this.currentPage * this.pageSize + 1;
  }

  getEndIndex(): number {
    return Math.min((this.currentPage + 1) * this.pageSize, this.totalElements);
  }

  getPages(): number[] {
    return Array.from({ length: this.totalPages }, (_, i) => i);
  }
}
