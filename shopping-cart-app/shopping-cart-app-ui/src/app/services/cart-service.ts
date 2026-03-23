import { Injectable } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private items: CartItem[] = [];

  constructor() {
    this.loadFromSessionStorage();
  }

  getItems(): CartItem[] {
    return this.items;
  }

  addItem(product: Product): void {
    const existing = this.items.find((item) => item.product.id === product.id);
    if (existing) {
      existing.quantity++;
    } else {
      this.items = [...this.items, { product: { ...product }, quantity: 1 }];
    }
    this.saveToSessionStorage();
  }

  removeItem(productId: number): void {
    this.items = this.items.filter((item) => item.product.id !== productId);
    this.saveToSessionStorage();
  }

  calculateTotal(): number {
    return this.items.reduce((total, item) => total + item.product.price * item.quantity, 0);
  }
  
  clear(): void {
    this.items = [];
    this.saveToSessionStorage();
  }

  private saveToSessionStorage(): void {
    sessionStorage.setItem('cart', JSON.stringify(this.items));
  }

  private loadFromSessionStorage(): void {
    const data = sessionStorage.getItem('cart');
    if (data) { this.items = JSON.parse(data) }
  }
}
