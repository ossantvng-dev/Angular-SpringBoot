import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  constructor(
    public authService: AuthService,
    private router: Router,
  ) {}

  get username(): string {
    return this.authService.getUsername();
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.finishLogout(),
      error: () => this.finishLogout(),
    });
  }

  private finishLogout(): void {
    this.authService.clearTokens();

    Swal.fire({
      title: 'Bye',
      text: 'Session closed successfully',
      icon: 'success',
      timer: 1500,
      showConfirmButton: false,
    });

    this.router.navigate(['/login']);
  }
}
