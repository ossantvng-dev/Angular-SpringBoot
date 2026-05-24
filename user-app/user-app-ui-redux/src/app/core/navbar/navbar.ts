import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as AuthSelectors from '../../auth/store/auth.selectors';
import * as AuthActions from '../../auth/store/auth.actions';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, AsyncPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  isAuthenticated$: Observable<boolean>;
  username$: Observable<string | null>;
  isAdmin$: Observable<boolean>;

  constructor(private store: Store) {

    this.isAuthenticated$ =
      this.store.select(AuthSelectors.selectIsAuthenticated);

    this.username$ =
      this.store.select(AuthSelectors.selectUsername);

    this.isAdmin$ =
      this.store.select(AuthSelectors.selectIsAdmin);
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}