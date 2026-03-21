import { Component, Input } from '@angular/core';
import { Invoice } from '../../models/invoice';
import { InvoiceService } from '../../services/invoice-service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-invoice-items',
  imports: [CurrencyPipe],
  templateUrl: './invoice-items.component.html',
  styleUrl: './invoice-items.component.css',
})
export class InvoiceItemsComponent {

  @Input() invoice!: Invoice;
  
  constructor(private invoiceService: InvoiceService) {}
  
  remove(index: number): void {
    this.invoiceService.removeItem(this.invoice, index);
  }

}
