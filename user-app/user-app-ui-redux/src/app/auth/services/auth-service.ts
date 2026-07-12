import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { AuthResponse } from '../models/auth-response';
import { LoginRequest } from '../models/login-request';
import { RefreshTokenRequest } from '../models/refresh-token-request';
import { environment } from '../../../environments/environment.prod';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl = `${environment.apiBaseUrl}/auth`;

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/login`, request);
  }

  refresh(request: RefreshTokenRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/refresh`, request);
  }

  logout(): Observable<void> {
    const token = this.getAccessToken();

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<void>(`${this.baseUrl}/logout`, {}, { headers });
  }

  saveTokens(accessToken: string, refreshToken: string): void {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refreshToken');
  }

  clearTokens(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
  }

  isAuthenticated(): boolean {
    const token = this.getAccessToken();

    if (!token) {
      return false;
    }

    return !this.isTokenExpired();
  }

  refreshAccessToken(): Observable<AuthResponse> {
    const token = this.getRefreshToken();

    return this.refresh({
      refreshToken: token!,
    });
  }

  getDecodedToken(): any {
    const token = this.getAccessToken();

    if (!token) {
      return null;
    }

    return jwtDecode(token);
  }

  getUsername(): string {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.sub || '';
  }

  isTokenExpired(): boolean {
    const decodedToken = this.getDecodedToken();

    if (!decodedToken) {
      return true;
    }

    const currentTime = Math.floor(Date.now() / 1000);

    return decodedToken.exp < currentTime;
  }

  getRoles(): string[] {
    const decodedToken = this.getDecodedToken();
    return decodedToken?.roles || [];
  }

  hasRole(role: string): boolean {
    return this.getRoles().includes(role);
  }

  isAdmin(): boolean {
    return this.hasRole('ROLE_ADMIN');
  }
}
