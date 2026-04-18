import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { selectCounter } from '../store/items.selectors';
import { decrement, increment, reset } from '../store/items.actions';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-counter',
  imports: [AsyncPipe],
  templateUrl: './counter.html',
  styleUrl: './counter.css',
})
export class Counter {
  title: string = 'Counter usando redux!';
  counter$;

  constructor(private store: Store) {
    this.counter$ = this.store.select(selectCounter);
  }

  increment(): void {
    this.store.dispatch(increment({ add: 3 }));
    console.log("Incrementando...");
  }

  decrement(): void {
    this.store.dispatch(decrement())
    console.log("Decrementando...");
  }

  reset(): void {
    this.store.dispatch(reset()); 
    console.log("Reseteando contador...");
  }
}
