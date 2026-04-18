import { createAction, props } from "@ngrx/store";
import { Product } from "../models/product";
import { CartItem } from "../models/cart-item";

export const addItem = createAction('[Cart] Add Item', props<{ product: Product }>());

export const removeItem = createAction('[Cart] Remove Item', props<{ productId: number }>());

export const clearCart = createAction('[Cart] Clear Cart');

export const loadCartFromSession = createAction('[Cart] Load Cart', props<{ items: CartItem[] }>());