import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth-service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  const router = inject(Router);

  const token = authService.getAccessToken();

  // token inexistente
  if (!token) {
    router.navigate(['/login']);
    return false;
  }

  // token corrupto
  try {
    authService.getDecodedToken();
  } catch {
    authService.clearTokens();

    router.navigate(['/login']);

    return false;
  }

  /*
    Token válido estructuralmente.
    Aunque esté expirado, dejamos pasar.

    El interceptor manejará refresh automático
    cuando ocurra un request HTTP real.
  */
  return true;
};
