import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../../models/cart-item';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {

  @Input() items: CartItem[] = [];

  @Output() showOrHideCartEventEmitter = new EventEmitter(); 
  
  showOrHideCart(): void {
    this.showOrHideCartEventEmitter.emit();
  }

}
