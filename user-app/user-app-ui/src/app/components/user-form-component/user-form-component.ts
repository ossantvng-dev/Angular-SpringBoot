import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { User } from '../../models/user';

@Component({
  selector: 'user-form-component',
  imports: [FormsModule],
  templateUrl: './user-form-component.html',
  styleUrl: './user-form-component.css',
})
export class UserFormComponent {
  @Input() user: User;

  @Output() newUserEventEmitter: EventEmitter<User> = new EventEmitter();

  @Output() openEventEmitter: EventEmitter<void> = new EventEmitter();

  constructor() {
    this.user = new User();
  }

  onSubmit(userForm: NgForm): void {
    if (userForm.valid) {
      this.newUserEventEmitter.emit(this.user);
    }
    
    /* 
      Borra los valores, pero el formulario puede seguir marcado como touched o dirty. 
    */
    userForm.reset();

    /* 
      Borra los valores y además “resetea” el estado de validación, 
      como si nunca hubieras interactuado con el formulario.
    */
    userForm.resetForm();
  }

  onClear(userForm: NgForm): void {
    userForm.resetForm();
  }
  
  onOpenClose(): void {
    this.openEventEmitter.emit();
  }
}
