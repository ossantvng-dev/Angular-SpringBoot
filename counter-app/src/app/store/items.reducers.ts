import { createReducer, on } from "@ngrx/store";
import { decrement, increment, reset } from "./items.actions";

export const initialState = 0;

/* Uso _ para indicar que no me interesa el valor anterior del estado, siempre devuelvo 0. */
export const counterReducer = createReducer(
    initialState,
    on(increment, (state, payload) => state + payload.add),
    on(decrement, state => state - 1),
    on(reset, _ => 0)
);