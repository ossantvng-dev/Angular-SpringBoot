import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProductService } from './services/product-service';
import { Product } from './models/product';
import { Catalog } from './components/catalog/catalog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Catalog],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {

  products: Product[] = [];
  
  protected readonly title = signal('shopping-cart-app-ui');

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.products = this.productService.findAll();
  }

}
