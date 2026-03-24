import { Injectable, signal } from '@angular/core';
import { CartItem } from '../models/cart-item';
import { Product } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  items = signal<CartItem[]>([]);

  constructor() {
    this.loadFromSessionStorage();
  }

  getItems(): CartItem[] {
    return this.items();
  }

  addItem(product: Product): void {
    const current = this.items();
    const existing = current.find((item) => item.product.id === product.id);
    if (existing) {
      existing.quantity++;
      this.items.set([...current]);
    } else {
      this.items.set([...current, { product: { ...product }, quantity: 1 }]);
    }
    this.saveToSessionStorage();
  }

  removeItem(productId: number): void {
    const updated = this.items().filter((item) => item.product.id !== productId);
    this.items.set(updated);
    this.saveToSessionStorage();
  }

  calculateTotal(): number {
    return this.items().reduce((total, item) => total + item.product.price * item.quantity, 0);
  }

  clear(): void {
    this.items.set([]);
    this.saveToSessionStorage();
  }

  private saveToSessionStorage(): void {
    sessionStorage.setItem('cart', JSON.stringify(this.items()));
  }

  private loadFromSessionStorage(): void {
    const data = sessionStorage.getItem('cart');
    if (data) {
      this.items.set(JSON.parse(data));
    }
  }
}
