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

import { AlertService } from '../services/alert-service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private alert: AlertService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        /*
          Login y refresh NO muestran popup global
          porque esos errores los maneja AuthEffects
        */
        if (this.isAuthUrl(req.url)) {
          return throwError(() => err);
        }

        let message = 'Unexpected error';

        if (err.error?.message) {
          message = err.error.message;
        }

        /*
          SOLO errores globales NO auth
        */
        if (err.status !== 401) {
          this.alert.error(message);
        }

        return throwError(() => err);
      }),
    );
  }

  private isAuthUrl(url: string): boolean {
    return url.includes('/auth/login') || url.includes('/auth/refresh');
  }
}
