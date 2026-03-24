import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Product } from '../../models/product';
import { ProductCard } from "../product-card/product-card";

@Component({
  selector: 'app-catalog',
  imports: [ProductCard],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {

  @Input() products!: Product[];
  
  @Output() add: EventEmitter<Product> = new EventEmitter();
  
  onAddProductToCart(product: Product) {
    this.add.emit(product);
  }
}
