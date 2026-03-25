import { Component, EventEmitter, Output, effect } from '@angular/core';
import { CartService } from '../../services/cart-service';
import { Cart } from '../cart/cart';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-cart-modal',
  standalone: true,
  imports: [Cart],
  templateUrl: './cart-modal.html',
  styleUrl: './cart-modal.css',
})
export class CartModal {
  @Output() close = new EventEmitter<void>();

  constructor(private cartService: CartService) {
    /* 
      Este effect se ejecuta cada vez que cambia el carrito 

      Cada vez que: items.set(...), items.update(...) y items() cambia Angular ejecuta el effect.

      No importa:

        • 	si el modal está abierto
        • 	si el modal no tiene Inputs
        • 	si App no re-renderiza
        • 	si el array es el mismo
        • 	si el cambio viene de otro componente
      
      El modal SIEMPRE se entera.
      
    */
    effect(() => {
      const items = this.cartService.items();
      console.log('Carrito cambió (signal):', items);
    });
  }

  get items() {
    return this.cartService.items();
  }

  onClose() {
    this.close.emit();
  }

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
        this.cartService.removeItem(productId);
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
