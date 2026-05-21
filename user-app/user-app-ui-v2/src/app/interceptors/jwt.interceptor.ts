import { Injectable } from '@angular/core';

import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
} from '@angular/common/http';

import { Observable, throwError } from 'rxjs';

import { catchError, switchMap } from 'rxjs/operators';

import { AuthService } from '../services/auth-service';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authService.getAccessToken();

    let authReq = req;

    if (token && !req.url.includes('/auth/login') && !req.url.includes('/auth/refresh')) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        if (
          error.status === 401 &&
          !req.url.includes('/auth/login') &&
          !req.url.includes('/auth/refresh')
        ) {
          return this.authService.refreshAccessToken().pipe(
            switchMap((response) => {
              this.authService.saveTokens(response.accessToken, response.refreshToken);

              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${response.accessToken}`,
                },
              });

              return next.handle(retryReq);
            }),

            catchError((refreshError) => {
              this.authService.clearTokens();

              return throwError(() => refreshError);
            }),
          );
        }

        return throwError(() => error);
      }),
    );
  }
}
