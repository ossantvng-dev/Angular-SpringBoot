import { Component, Input } from '@angular/core';
import { Invoice } from '../../models/invoice';
import { InvoiceService } from '../../services/invoice-service';
import { CurrencyPipe } from '@angular/common';
import { Item } from '../../models/item';
import { InvoiceAddItemComponent } from '../invoice-add-item/invoice-add-item.component';

@Component({
  selector: 'app-invoice-items',
  imports: [CurrencyPipe, InvoiceAddItemComponent],
  templateUrl: './invoice-items.component.html',
  styleUrl: './invoice-items.component.css',
})
export class InvoiceItemsComponent {

  @Input() invoice!: Invoice;

  showAddItem: boolean = false;
  
  constructor(private invoiceService: InvoiceService) {}
  
  remove(index: number): void {
    this.invoiceService.removeItem(this.invoice, index);
  }

  addItem(item: Item): void {
    this.invoice.items.push(item);
    this.showAddItem = false;
  }

}
