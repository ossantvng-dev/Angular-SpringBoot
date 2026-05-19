import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../../services/user-service';

@Component({
  selector: 'user-form-component',
  imports: [FormsModule],
  templateUrl: './user-form-component.html',
  styleUrl: './user-form-component.css',
})
export class UserFormComponent {
  user: User;
  formErrors: { [key: string]: string } = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService,
  ) {
    this.user = history.state['user'] ?? new User();
    const id = this.route.snapshot.paramMap.get('id');
    if (!this.user.id && id) {
      this.userService.findById(+id).subscribe((u) => {
        this.user = u ?? new User();
      });
    }
  }

  onSubmit(userForm: NgForm): void {
    if (this.user.id > 0) {
      this.userService.update(this.user).subscribe({
        next: () => this.router.navigate(['/users']),
        error: (err) => {
          if (err.status === 400 && err.error) {
            this.formErrors = err.error;
          }
        },
      });
    } else {
      this.userService.create(this.user).subscribe({
        next: () => this.router.navigate(['/users']),
        error: (err) => {
          if (err.status === 400 && err.error) {
            this.formErrors = err.error;
          }
        },
      });
    }
  }

  onClear(userForm: NgForm): void {
    this.user = new User();
    this.formErrors = {};
    userForm.resetForm();
  }
}
