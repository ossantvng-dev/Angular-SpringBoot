import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CartItem } from '../../models/cart-item';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  @Input() items: CartItem[] = [];

  @Output() remove: EventEmitter<number> = new EventEmitter();

  onDeleteProductFromCart(id: number) {
    this.remove.emit(id);
  }
}
