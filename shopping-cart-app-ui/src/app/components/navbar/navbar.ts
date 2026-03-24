import { Component, EventEmitter, Output } from '@angular/core';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Output() showOrHideCartEventEmitter = new EventEmitter<void>();

  constructor(private cartService: CartService) {}

  // contador reactivo usando Signals
  get itemsCount(): number {
    return this.cartService.items().length;
  }

  showOrHideCart(): void {
    this.showOrHideCartEventEmitter.emit();
  }
}
