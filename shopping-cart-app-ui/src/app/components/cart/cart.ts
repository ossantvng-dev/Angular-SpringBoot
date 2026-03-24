import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../../models/cart-item';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  @Input() items: CartItem[] = [];

  @Output() remove: EventEmitter<number> = new EventEmitter();

  constructor(private cartService: CartService) {}

  get total(): number {
    return this.cartService.calculateTotal();
  }

  onDeleteProductFromCart(id: number) {
    this.remove.emit(id);
  }
}
