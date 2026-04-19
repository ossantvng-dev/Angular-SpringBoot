import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';
import { USERS_MOCK_LIST } from '../utils/user.mock.data';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  constructor() {}

  /* // Retorna un Observable que emite la lista de usuarios (simula respuesta de backend) */
  findAll(): Observable<User[]> { return of(USERS_MOCK_LIST); }


}
