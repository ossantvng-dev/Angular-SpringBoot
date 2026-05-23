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
  private isRefreshing = false;

  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // No interceptar auth endpoints
    if (this.isAuthUrl(req.url)) {
      return next.handle(req);
    }

    // obtener token
    const token = this.authService.getAccessToken();

    // clonar request si hay token
    const authReq = token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // no es 401 → error normal
        if (error.status !== 401 || this.isAuthUrl(req.url)) {
          return throwError(() => error);
        }

        // si ya hay refresh en curso → no intentar otro
        if (this.isRefreshing) {
          return throwError(() => error);
        }

        this.isRefreshing = true;

        // intentar refresh token
        return this.authService.refreshAccessToken().pipe(
          switchMap((response) => {
            this.isRefreshing = false;

            // guardar nuevos tokens
            this.authService.saveTokens(response.accessToken, response.refreshToken);

            // reintentar request original
            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`,
              },
            });

            return next.handle(retryReq);
          }),

          catchError((refreshError) => {
            this.isRefreshing = false;

            // refresh falló → limpiar sesión
            this.authService.clearTokens();

            return throwError(() => refreshError);
          }),
        );
      }),
    );
  }

  private isAuthUrl(url: string): boolean {
    return url.includes('/auth/login') || url.includes('/auth/refresh');
  }
}
