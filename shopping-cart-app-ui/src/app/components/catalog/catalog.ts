import { Component } from '@angular/core';
import { ProductCard } from '../product-card/product-card';
import { products } from '../../data/product.data';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [ProductCard],
  templateUrl: './catalog.html',
  styleUrl: './catalog.css',
})
export class Catalog {
  products = products;
}