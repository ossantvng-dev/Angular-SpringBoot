import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as AuthActions from '../store/auth.actions';
import { Store } from '@ngrx/store';
import { Spinner } from '../../shared/spinner/spinner';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import * as AuthSelectors from '../store/auth.selectors';

@Component({
  selector: 'app-login-component',
  imports: [FormsModule, Spinner, AsyncPipe],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  username = '';
  password = '';

  loading$: Observable<boolean>;
  
  constructor(private store: Store) {
    this.loading$ = this.store.select(AuthSelectors.selectAuthLoading);
  }

  onSubmit(): void {
    this.store.dispatch(
      AuthActions.login({
        request: {
          username: this.username,
          password: this.password,
        },
      }),
    );
  }
}
