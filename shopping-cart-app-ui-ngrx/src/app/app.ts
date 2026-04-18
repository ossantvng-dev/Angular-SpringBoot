import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductService } from './services/product-service';
import { Product } from './models/product';
import { Navbar } from './components/navbar/navbar';
import { CartModal } from './components/cart-modal/cart-modal';

@Component({
  selector: 'app-root',
  standalone: true,
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
  ) {}

  ngOnInit(): void {
    this.products = this.productService.findAll();
  }

  showOrHideCart(): void {
    this.showModal = !this.showModal;
  }
  
}
