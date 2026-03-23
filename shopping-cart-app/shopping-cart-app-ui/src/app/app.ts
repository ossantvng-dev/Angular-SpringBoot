import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductService } from './services/product-service';
import { Product } from './models/product';
import { Catalog } from './components/catalog/catalog';
import { Cart } from './components/cart/cart';
import { CartItem } from './models/cart-item';
import { CartService } from './services/cart-service';
import { Navbar } from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Catalog, Cart, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  products: Product[] = [];

  showCart: boolean = false;

  protected readonly title = signal('shopping-cart-app-ui');

  constructor(
    private productService: ProductService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.products = this.productService.findAll();
  }

  showOrHideCart(): void {
    this.showCart = !this.showCart;
  }
  
  get items(): CartItem[] {
    return this.cartService.getItems();
  }

  onAddProductToCart(product: Product) {
    this.cartService.addItem(product);
  }

  onRemoveItemFromCart(productId: number) {
    this.cartService.removeItem(productId);
  }
}
