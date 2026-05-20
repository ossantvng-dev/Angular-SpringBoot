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

        if (err.error && err.error.message) {
          // ApiError has a message field
          message = err.error.message;
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
