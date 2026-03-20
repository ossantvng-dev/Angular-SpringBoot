import { Component, Input } from '@angular/core';
import { Item } from '../../models/item';

@Component({
  selector: 'app-invoice-items',
  imports: [],
  templateUrl: './invoice-items.component.html',
  styleUrl: './invoice-items.component.css',
})
export class InvoiceItemsComponent {
  @Input() items!: Item[];
}
