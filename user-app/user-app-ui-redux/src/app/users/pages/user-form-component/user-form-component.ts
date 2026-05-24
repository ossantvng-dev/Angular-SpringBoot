import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';

import { User } from '../../models/user';
import { UserService } from '../../services/user-service';

import * as UsersActions from '../../store/users.actions';
import * as UsersSelectors from '../../store/users.selectors';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'user-form-component',
  imports: [FormsModule, AsyncPipe],
  templateUrl: './user-form-component.html',
  styleUrl: './user-form-component.css',
})
export class UserFormComponent {
  user: User;

  loading$;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private store: Store,
  ) {
    this.loading$ = this.store.select(UsersSelectors.selectUsersLoading);

    // 1. Try getting the object from history.state
    this.user = history.state['user'] ?? new User();

    // 2. If object does not come in the state, use param id
    const id = this.route.snapshot.paramMap.get('id');

    if (!this.user.id && id) {
      console.log('Loading user from service ...');

      this.userService.findById(+id).subscribe((u) => {
        this.user = u ?? new User();
      });
    }
  }

  onSubmit(userForm: NgForm): void {
    if (!userForm.valid) {
      return;
    }

    // UPDATE
    if (this.user.id) {
      this.store.dispatch(
        UsersActions.updateUser({
          id: this.user.id,
          request: this.user,
        }),
      );

      return;
    }

    // CREATE
    this.store.dispatch(
      UsersActions.createUser({
        request: this.user,
      }),
    );
  }

  onClear(userForm: NgForm): void {
    this.user = new User();

    userForm.resetForm();
  }
}
