import { Component, Input } from '@angular/core';
import { Product } from '../../models/product';
import { CartService } from '../../services/cart-service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {

  @Input() product!: Product;

  constructor(private cartService: CartService) {}

  onAddProductToCart() {
    this.cartService.addItem(this.product);
  }
}