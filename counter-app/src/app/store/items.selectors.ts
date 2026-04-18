import { createFeatureSelector } from "@ngrx/store";

/*
    createFeatureSelector<number> → defines que el selector devuelve un number.
    'counter' → es el nombre de la feature key
    selectCounter → es la función que puedes usar en tus componentes para obtener el valor actual del contador.
*/
export const selectCounter = createFeatureSelector<number>('counter');