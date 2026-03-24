import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductService } from './services/product-service';
import { Product } from './models/product';
import { CartItem } from './models/cart-item';
import { CartService } from './services/cart-service';
import { Navbar } from './components/navbar/navbar';
import { CartModal } from './components/cart-modal/cart-modal';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, CartModal],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  products: Product[] = [];

  showModal: boolean = false;

  protected readonly title = signal('shopping-cart-app-ui');

  constructor(
    private productService: ProductService,
    private cartService: CartService,
  ) {}

  ngOnInit(): void {
    this.products = this.productService.findAll();
  }

  showOrHideCart(): void {
    this.showModal = !this.showModal;
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
