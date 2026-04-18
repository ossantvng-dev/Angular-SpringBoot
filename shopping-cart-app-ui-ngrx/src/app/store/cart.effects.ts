import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { addItem, loadCartFromSession, removeItem } from './cart.action';
import { map, tap, withLatestFrom } from 'rxjs/operators';
import { CartItem } from '../models/cart-item';
import { Store } from '@ngrx/store';
import { AppState } from './app.state';
import { selectCartItems } from './cart.selectors';


/* 
  En Angular moderno (standalone + DI), los field initializers se ejecutan antes de que el constructor 
  inyecte dependencias en ciertos contextos de NgRx.

  Tuve que usar private actions$ = inject(Actions); y private store = inject(Store<AppState>);
  porque la inyección falló en el constructor.
*/

@Injectable()
export class CartEffects {
  
  private actions$ = inject(Actions);

  private store = inject(Store<AppState>);

  /* 
    Guardar carrito en sessionStorage cada vez que cambia.
    
    ofType:
      Filtra las acciones que pasan por el stream (solo addItem y removeItem).
    
    withLatestFrom:
      Combina la acción con el estado actual del carrito en el store.
    
    tap:
      Ejecuta un efecto secundario (guardar en sessionStorage).
  */
  persistCart$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(addItem, removeItem),
        withLatestFrom(this.store.select(selectCartItems)),
        tap(([action, items]) => {
          sessionStorage.setItem('cart', JSON.stringify(items));
        }),
      );
    },
    { dispatch: false },
  );

  /*
    Cargar carrito desde sessionStorage al iniciar.
    
    of:
      Crea un Observable a partir del valor en sessionStorage.
    
    map:
      Transforma ese valor en una acción loadCartFromSession.
  */
  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      // se dispara una sola vez al arrancar
      ofType('@ngrx/effects/init'),
      map(() => {
        const cartState = sessionStorage.getItem('cart');
        const items: CartItem[] = cartState ? JSON.parse(cartState) : [];
        return loadCartFromSession({ items });
      }),
    ),
  );

  test$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType('@ngrx/effects/init'),
        tap(() => console.log('Effects initialized')),
      ),
    { dispatch: false },
  );
}
