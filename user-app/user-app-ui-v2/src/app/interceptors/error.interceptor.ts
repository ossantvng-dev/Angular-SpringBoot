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

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        let message = 'Unexpected error';

        if (err.status === 400 && err.error) {
          // backend returns Map<String,String>
          message = Object.entries(err.error)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join('\n');
        } else if (err.status === 500 && err.error?.error) {
          message = err.error.error;
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
