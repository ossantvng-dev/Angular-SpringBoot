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

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        /*
          Login y refresh NO muestran popup global
        */
        if (this.isAuthUrl(req.url)) {
          return throwError(() => err);
        }

        let message = 'Unexpected error';

        if (err.error?.message) {
          message = err.error.message;
        }

        /*
          SOLO errores no-auth
        */
        if (err.status !== 401) {
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
