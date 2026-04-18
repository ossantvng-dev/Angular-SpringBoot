/*
    Los selectores son funciones que nos permiten leer el estado del store de manera limpia y reutilizable. 

    En lugar de que cada componente acceda directamente a state.cart.items, 
    usamos selectores para mantener el código organizado.
*/

import { createFeatureSelector, createSelector } from "@ngrx/store";
import { CartState } from "./cart.state";

// Selecciona el slice "cart" del estado global
export const selectCartState = createFeatureSelector<CartState>('cart');

// Selecciona todos los items del carrito
export const selectCartItems = createSelector(
    selectCartState, 
    (state: CartState) => state.items
);

// Suma todas las cantidades para mostrar el número de productos en el carrito.
export const selectCartCount = createSelector(
  selectCartItems,
  (items) => items.reduce((count, item) => count + item.quantity, 0)
);

// Selecciona el total en dinero
export const selectCartTotal = createSelector(
  selectCartItems,
  (items) => items.reduce((total, item) => total + item.product.price * item.quantity, 0)
);