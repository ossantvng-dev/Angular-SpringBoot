import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user';
import { UserService } from '../../services/user-service';
import { UserListComponent } from '../user-list-component/user-list-component';
import { UserFormComponent } from '../user-form-component/user-form-component';
import { getNextUserId } from '../../utils/utils';
import Swal from 'sweetalert2';

@Component({
  selector: 'user-app',
  imports: [UserListComponent, UserFormComponent],
  templateUrl: './user-app-component.html',
  styleUrl: './user-app-component.css',
})
export class UserAppComponent implements OnInit {
  title: string = 'Listado de usuarios';

  users: User[] = [];

  selectedUser: User;

  open: boolean = false;

  constructor(private userService: UserService) {
    this.selectedUser = new User();
  }

  ngOnInit(): void {
    this.userService.findAll().subscribe((users) => (this.users = users));
  }

  /*
    Cuando creamos un nuevo user:

      ...this.users → copia todos los elementos del arreglo users en un nuevo arreglo.

      { ...user, id: getNextUserId(this.users) } → copia todas las propiedades del objeto user en un nuevo objeto, 
                                                   y luego sobrescribe la propiedad id con el nuevo valor.

      Resultado: un nuevo arreglo con todos los usuarios anteriores + el nuevo usuario con un id actualizado.
    
    Cuando actualizamos el user:

      { ...user } → crea una copia superficial del objeto user.
                    Esto evita mutar directamente el objeto original y mantiene 
                    la inmutabilidad (buena práctica en Angular/React).


  */
  addUser(user: User): void {
    if (user.id > 0) {
      // update
      this.users = this.users.map((u) => (u.id === user.id ? { ...user } : u));
      Swal.fire({
        title: 'User updated',
        text: `User with ID ${user.id} was successfully updated.`,
        icon: 'success',
        confirmButtonText: 'OK',
      });
    } else {
      // create
      const newUser = { ...user, id: getNextUserId(this.users) };
      this.users = [...this.users, newUser];
      Swal.fire({
        title: 'User created',
        text: `User ${newUser.name} was created with ID ${newUser.id}.`,
        icon: 'success',
        confirmButtonText: 'OK',
      });
    }
    this.selectedUser = new User();
    this.setClose();
  }

  removeUser(userId: number): void {
    this.users = this.users.filter((user) => user.id !== userId);
  }

  /* { ...user } devuelve una copia del objeto user */
  setSelectedUser(user: User): void {
    this.selectedUser = { ...user };
    this.setOpen();
  }

  setOpenCreate(): void {
    this.selectedUser = new User();
    this.setOpen();
  }

  setOpen(): void {
    this.open = true;
  }

  setClose(): void {
    this.open = false;
  }
}
