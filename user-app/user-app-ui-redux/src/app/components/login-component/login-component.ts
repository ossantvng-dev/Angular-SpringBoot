import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as AuthActions from '../../auth/auth.actions';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-login-component',
  imports: [FormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private store: Store) {}

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
