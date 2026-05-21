import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login-component',
  imports: [FormsModule],
  templateUrl: './login-component.html',
  styleUrl: './login-component.css',
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onSubmit(): void {
    this.authService
      .login({
        username: this.username,
        password: this.password,
      })
      .subscribe({
        next: (response) => {
          this.authService.saveTokens(response.accessToken, response.refreshToken);
          
          Swal.fire({
            title: 'Welcome',
            text: 'Login successful',
            icon: 'success',
            timer: 1500,
            showConfirmButton: false,
          });

          this.router.navigate(['/users']);
        },
      });
  }
}
