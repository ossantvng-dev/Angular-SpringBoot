import { Injectable } from '@angular/core';
import Swal, { SweetAlertIcon } from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class AlertService {
  success(message: string, title: string = 'Success'): void {
    this.show(title, message, 'success');
  }

  error(message: string, title: string = 'Error'): void {
    this.show(title, message, 'error');
  }

  warning(message: string, title: string = 'Warning'): void {
    this.show(title, message, 'warning');
  }

  info(message: string, title: string = 'Info'): void {
    this.show(title, message, 'info');
  }

  private show(title: string, text: string, icon: SweetAlertIcon): void {
    Swal.fire({
      title,
      text,
      icon,
      timer: icon === 'success' ? 1500 : undefined,
      showConfirmButton: icon !== 'success',
    });
  }
}
