import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user-service';
import { UserListComponent } from "../user-list-component/user-list-component";

@Component({
  selector: 'user-app',
  imports: [UserListComponent],
  templateUrl: './user-app-component.html',
  styleUrl: './user-app-component.css',
})
export class UserAppComponent implements OnInit {

  title: string = 'Listado de usuarios';
  
  users: User[] = [];
  
  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.findAll().subscribe(users => this.users = users);
  }  
}
