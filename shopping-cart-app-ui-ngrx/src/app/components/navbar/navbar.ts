import { Component, EventEmitter, Output } from '@angular/core';
import { selectCartCount } from '../../store/cart.selectors';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import { Observable } from 'rxjs';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  @Output() showOrHideCartEventEmitter = new EventEmitter<void>();

  itemsCount$: Observable<number>;

  constructor(private store: Store<AppState>) {
     this.itemsCount$ = this.store.select(selectCartCount);
  }

  showOrHideCart(): void {
    this.showOrHideCartEventEmitter.emit();
  }
}
