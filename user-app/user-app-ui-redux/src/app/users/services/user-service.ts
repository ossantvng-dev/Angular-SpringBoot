import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Pagination } from '../../shared/models/pagination';
import { CreateUserRequest } from '../models/create-user-request';
import { UpdateUserRequest } from '../models/update-user-request';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private apiUrl = `${environment.apiBaseUrl}/api/users`;

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

  findById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${userId}`);
  }

  create(request: CreateUserRequest): Observable<User> {
    return this.http.post<User>(this.apiUrl, request);
  }

  update(userId: number, request: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${userId}`, request);
  }

  remove(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`);
  }

}