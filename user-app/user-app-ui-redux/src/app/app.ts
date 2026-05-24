import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Store } from '@ngrx/store';
import * as AuthActions from './auth/store/auth.actions';
import { Navbar } from './core/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly title = signal('user-app-ui-redux');

  constructor(
    private router: Router,
    private store: Store,
  ) {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (accessToken && refreshToken) {
      this.store.dispatch(AuthActions.restoreSession());
    }
  }

  isLoginRoute(): boolean {
    return this.router.url === '/login';
  }
}
