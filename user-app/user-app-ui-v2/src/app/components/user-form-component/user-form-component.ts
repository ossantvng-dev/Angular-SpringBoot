import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'user-form-component',
  imports: [FormsModule],
  templateUrl: './user-form-component.html',
  styleUrl: './user-form-component.css',
})
export class UserFormComponent {
  user: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
  ) {
    // 1. Try getting the object from history.state
    this.user = history.state['user'] ?? new User();

    // 2. If object does not come in the state, use param id
    const id = this.route.snapshot.paramMap.get('id');

    //console.log('user.id:', this.user.id, 'route id:', id);

    if (!this.user.id && id) {
      console.log('Loading user from service ...');
      this.userService.findById(+id).subscribe((u) => {
        this.user = u ?? new User();
      });
    }
  }

  onSubmit(userForm: NgForm): void {
    if (userForm.valid) {
      if (this.user.id > 0) {
        this.userService.update(this.user).subscribe(() => {
          Swal.fire({
            title: 'User updated',
            text: `User ${this.user.name} was successfully updated.`,
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => this.router.navigate(['/users']));
        });
      } else {
        this.userService.create(this.user).subscribe(() => {
          Swal.fire({
            title: 'User created',
            text: `User ${this.user.name} was successfully created.`,
            icon: 'success',
            confirmButtonText: 'OK',
          }).then(() => this.router.navigate(['/users']));
        });
      }
    }
  }

  onClear(userForm: NgForm): void {
    this.user = new User();
    userForm.resetForm();
  }
}
