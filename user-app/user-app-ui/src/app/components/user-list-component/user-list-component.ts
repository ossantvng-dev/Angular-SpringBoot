import { Component, Input } from '@angular/core';
import { User } from '../../models/user';

@Component({
  selector: 'user-list-component',
  imports: [],
  templateUrl: './user-list-component.html',
  styleUrl: './user-list-component.css',
})
export class UserListComponent {
  @Input() users: User[] = [];
}
