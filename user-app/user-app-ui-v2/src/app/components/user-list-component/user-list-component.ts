import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import Swal from 'sweetalert2';
import { RouterModule } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'user-list-component',
  imports: [RouterModule],
  templateUrl: './user-list-component.html',
  styleUrl: './user-list-component.css',
})
export class UserListComponent implements OnInit {
  title: string = 'User List';

  users: User[] = [];

  constructor(
    private userService: UserService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.findAll().subscribe(users => {
      this.users = users;
      this.cdr.detectChanges();
    });
  }

  /*onRemoveUser(userId: number): void {
    this.userService.removeV2(userId).subscribe(() => {
      this.loadUsers();
    });
  }*/

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
          this.cdr.detectChanges();
        });
      }
    });
  }
}
