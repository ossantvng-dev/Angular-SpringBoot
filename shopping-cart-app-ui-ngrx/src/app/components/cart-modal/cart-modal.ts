import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Cart } from '../cart/cart';
import Swal from 'sweetalert2';
import { AppState } from '../../store/app.state';
import { Store } from '@ngrx/store';
import { selectCartItems, selectCartTotal } from '../../store/cart.selectors';
import { CartItem } from '../../models/cart-item';
import { Observable } from 'rxjs';
import { removeItem } from '../../store/cart.action';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [Cart, AsyncPipe],
  templateUrl: './cart-modal.html',
  styleUrl: './cart-modal.css',
})
export class CartModal {

  // Evento para cerrar el modal
  @Output() close = new EventEmitter<void>();

  // Input para recibir items (acepta null por compatibilidad con async pipe)
  @Input() items: CartItem[] | null = [];

  // Observable que emite el array de items desde el store
  items$: Observable<CartItem[]>;

  total$: Observable<number>;

  constructor(private store: Store<AppState>) {
    // Conectamos el observable al selector de NgRx
    this.items$ = this.store.select(selectCartItems);
    this.total$ = this.store.select(selectCartTotal);
  }

  // Método para emitir el evento de cierre
  onClose() {
    this.close.emit();
  }

  // Método para eliminar un producto del carrito
  onRemove(productId: number) {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: 'Este producto será eliminado del carrito',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    }).then((result) => {
      if (result.isConfirmed) {
        this.store.dispatch(removeItem({ productId }));
        Swal.fire({
          icon: 'success',
          title: 'Producto eliminado',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  }
}
