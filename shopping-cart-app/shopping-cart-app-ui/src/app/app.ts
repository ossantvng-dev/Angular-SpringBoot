import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductService } from './services/product-service';
import { Product } from './models/product';
import { Catalog } from './components/catalog/catalog';
import { Cart } from './components/cart/cart';
import { CartItem } from './models/cart-item';
import { CartService } from './services/cart-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Catalog, Cart],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  products: Product[] = [];

  items: CartItem[] = [];

  protected readonly title = signal('shopping-cart-app-ui');

  constructor(
    private productService: ProductService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.products = this.productService.findAll();
  }

  onAddProductToCart(product: Product) {
    this.cartService.addItem(product);
    this.items = this.cartService.getItems();
  }

  onRemoveItemFromCart(productId: number) {
    this.cartService.removeItem(productId);
    this.items = this.cartService.getItems();
  }
}
