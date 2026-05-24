import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable, of } from 'rxjs';
import { USERS_MOCK_LIST } from '../../shared/utils/user.mock.data';
import { getNextUserId } from '../../shared/utils/utils';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pagination } from '../../shared/models/pagination';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private users: User[] = USERS_MOCK_LIST;

  private apiUrl = 'http://localhost:8080/api/users';

  constructor(private http: HttpClient) {}

  findAll(page?: number, size?: number): Observable<Pagination<User>> {
    let params = new HttpParams();
    if (page !== undefined && size !== undefined) {
      params = params.set('page', page.toString()).set('size', size.toString());
    } else {
      params = params.set('page', '0').set('size', '20');
    }
    return this.http.get<Pagination<User>>(this.apiUrl, { params });   
  }

  findAllV2(): Observable<User[]> {
    return of([...this.users]);
  }

  findById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  findByIdV2(userId: number): Observable<User | undefined> {
    return of(this.users.find((u) => u.id === userId));
  }

  create(user: User): Observable<User> {
    return this.http.post<User>(this.apiUrl, user);
  }

  createV2(user: User): Observable<User> {
    user.id = getNextUserId(this.users);
    this.users.push(user);
    return of(user);
  }

  update(user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${user.id}`, user);
  }

  updateV2(user: User): Observable<User> {
    this.users = this.users.map((u) => (u.id === user.id ? { ...user } : u));
    return of(user);
  }

  remove(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }

  removeV2(userId: number): Observable<void> {
    this.users = this.users.filter(u => u.id !== userId);
    return of(void 0);
  }
}