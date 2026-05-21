import { Injectable } from '@angular/core';

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
  HttpEvent,
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
        let message = 'Unexpected error';

        if (err.error && err.error.message) {
          message = err.error.message;
        }

        // Let JwtInterceptor to handle normal 401
        if (
          err.status === 401 &&
          !req.url.includes('/auth/login') &&
          !req.url.includes('/auth/refresh')
        ) {
          return throwError(() => err);
        }

        // Only if refresh fails => real logout
        if (err.status === 401 && req.url.includes('/auth/refresh')) {
          this.authService.clearTokens();

          this.router.navigate(['/login']);
        }

        Swal.fire({
          title: 'Error',
          text: message,
          icon: 'error',
        });

        return throwError(() => err);
      }),
    );
  }
}
