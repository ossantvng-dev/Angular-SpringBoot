import { Injectable, inject } from '@angular/core';

import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

import { selectAccessToken } from '../auth/auth.selectors';

import { take, switchMap } from 'rxjs/operators';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private store = inject(Store);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // No interceptar endpoints auth
    if (this.isAuthUrl(req.url)) {
      return next.handle(req);
    }

    return this.store.select(selectAccessToken).pipe(
      take(1),

      switchMap((token) => {
        if (!token) {
          return next.handle(req);
        }

        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });

        return next.handle(authReq);
      }),
    );
  }

  private isAuthUrl(url: string): boolean {
    return url.includes('/auth/login') || url.includes('/auth/refresh');
  }
}
