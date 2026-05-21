import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        // Login / refresh no se interceptan como errores globales
        if (this.isAuthUrl(req.url)) {
          return throwError(() => err);
        }

        const isAuthError = err.status === 401;
        const isRefreshRequest = req.url.includes('/auth/refresh');

        let message = 'Unexpected error';

        if (err.error?.message) {
          message = err.error.message;
        }

        /*
          Si refresh falla => logout real
          (esto significa: refresh token inválido o expirado)
        */
        if (isAuthError && isRefreshRequest) {
          this.authService.clearTokens();

          this.router.navigate(['/login']);

          Swal.fire({
            title: 'Session expired',
            text: 'Please login again',
            icon: 'warning',
          });

          return throwError(() => err);
        }

        /*
          Solo mostrar errores no controlados:
          
          ¿Qué significa "no controlado" aquí?
          → errores que NO son parte del flujo de auth (login/refresh)
          → ejemplos: 500 backend, validaciones, errores de negocio, CORS, etc.
        */
        if (!isAuthError) {
          Swal.fire({
            title: 'Error',
            text: message,
            icon: 'error',
          });
        }

        return throwError(() => err);
      }),
    );
  }

  private isAuthUrl(url: string): boolean {
    return url.includes('/auth/login') || url.includes('/auth/refresh');
  }
}
