import { Component, Input } from '@angular/core';
import { Product } from '../../models/product';
import Swal from 'sweetalert2';
import { AppState } from '../../store/app.state';
import { Store } from '@ngrx/store';
import { addItem } from '../../store/cart.action';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard {
  @Input() product!: Product; // Recibe el producto desde el padre

  constructor(private store: Store<AppState>) {}

  onAddProductToCart() {
    this.store.dispatch(addItem({ product: this.product }));
    Swal.fire({
      position: 'top',
      icon: 'success',
      title: `${this.product.name} agregado al carrito`,
      showConfirmButton: false,
      timer: 1500,
    });
  }
}
