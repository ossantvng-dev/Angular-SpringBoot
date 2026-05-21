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

  /*
    Evita que múltiples requests fallen al mismo tiempo
  */
  private isRefreshing = false;

  constructor(private authService: AuthService) {}

    /**
   * INTERCEPTOR JWT
   *
   * RESPONSABILIDAD PRINCIPAL:
   * 1. Adjuntar el JWT (access token) a TODAS las requests HTTP protegidas
   * 2. Detectar 401 (token expirado)
   * 3. Intentar refrescar el token automáticamente
   * 4. Reintentar la petición original con el nuevo token
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    /* No interceptar endpoints de auth (login y refresh no llevan token) */
    if (this.isAuthUrl(req.url)) {
      return next.handle(req);
    }

    /* Obtener token actual del storage */
    const token = this.authService.getAccessToken();

    /* Si existe el token lo agregamos al request */
    const authReq = token
      ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        })
      : req;

    /* Enviar request al backend */
    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {

        /* Si no es 401 no hacemos nada especial*/
        if (error.status !== 401 || this.isAuthUrl(req.url)) {
          return throwError(() => error);
        }

        /* 
          Evitar múltiples refresh simultáneos: Si ya hay un refresh en curso
          no intentamos otro.
        */
        if (this.isRefreshing) {
          return throwError(() => error);
        }

        /* Marcamos que estamos refrescando token */
        this.isRefreshing = true;

        /* Intentamos obtener nuevo access token usando refresh token */
        return this.authService.refreshAccessToken().pipe(
          
          /*
            Si refresh funciona: 

              - guardamos nuevos tokens
              - repetimos request original
          */
          switchMap((response) => {
            this.isRefreshing = false;

            this.authService.saveTokens(response.accessToken, response.refreshToken);

            const retryReq = req.clone({
              setHeaders: {
                Authorization: `Bearer ${response.accessToken}`,
              },
            });

            return next.handle(retryReq);
          }),

          /*
            Si refresh falla: 

              - sesión completamente inválida
              - limpiamos storage
          */          
          catchError((refreshError) => {
            this.isRefreshing = false;
            this.authService.clearTokens();
            return throwError(() => refreshError);
          }),
        );
      }),
    );
  }

  /* Helper que evita interceptar endpoints de autenticación */
  private isAuthUrl(url: string): boolean {
    return url.includes('/auth/login') || url.includes('/auth/refresh');
  }
}
