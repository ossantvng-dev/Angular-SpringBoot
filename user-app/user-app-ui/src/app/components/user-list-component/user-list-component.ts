import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../models/user';
import Swal from 'sweetalert2';

@Component({
  selector: 'user-list-component',
  imports: [],
  templateUrl: './user-list-component.html',
  styleUrl: './user-list-component.css',
})
export class UserListComponent {
  @Input() users: User[] = [];

  @Output() userIdEventEmitter: EventEmitter<number> = new EventEmitter();

  @Output() selectedUserEventEmitter: EventEmitter<User> = new EventEmitter();

  onRemoveUser(userId: number): void {
    Swal.fire({
      title: '¿Are you sure?',
      text: 'User will be permanently deleted',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
    }).then((result) => {
      if (result.isConfirmed) {
        this.userIdEventEmitter.emit(userId);
        Swal.fire('Deleted', 'User has been deleted.', 'success');
      }
    });
  }

  onSelectedUser(user: User): void {
    this.selectedUserEventEmitter.emit(user);
  }
}
