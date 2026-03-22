import { Component, Input } from '@angular/core';
import { CartItem } from '../../models/cart-item';

@Component({
  selector: 'app-cart',
  imports: [],
  templateUrl: './cart.html',
  styleUrl: './cart.css',
})
export class Cart {

  @Input() items: CartItem[] = [];
}
