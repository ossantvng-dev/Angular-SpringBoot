import { createReducer, on } from '@ngrx/store';
import { CartState, initialCartState } from './cart.state';
import { addItem, clearCart, loadCartFromSession, removeItem } from './cart.action';

export const cartReducer = createReducer(
  initialCartState,
  // si el producto ya existe, incrementa la cantidad; si no, lo agrega con cantidad 1.
  on(addItem, (state: CartState, { product }) => {
    const existingCartItem = state.items.find((cartItem) => cartItem.product.id === product.id);
    if (existingCartItem) {
      return {
        ...state, // nuevo estado
        items: state.items.map((cartItem) =>
          cartItem.product.id === product.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        ),
      };
    }
    return {
      ...state, // nuevo estado con todos los datos anteriores
      items: [...state.items, { product, quantity: 1 }] // un array items que incluye el nuevo producto.
    };
  }),
  // filtra el array para eliminar el producto por id.
  on(removeItem, (state, { productId }) => {
    return {
      ...state, // nuevo estado con todos los datos anteriores
      items: state.items.filter((cartItem) => cartItem.product.id !== productId) // un array filtrado (sin el producto eliminado).
    };
  }),
  // vacía el carrito.
  on(clearCart, (state) => {
    return {
      ...state, // nuevo estado con todos los datos anteriores
      items: [], // un array vacío
    };
  }),
  //  inicializa el carrito con los items guardados en sessionStorage
  on(loadCartFromSession, (state, { items }) => {
    return {
      ...state, // nuevo estado con todos los datos anteriores
      items: [...items], // items cargados desde sessionStorage
    };
  }),
);
