import { Component, Input } from '@angular/core';
import { Invoice } from '../../models/invoice';
import { InvoiceService } from '../../services/invoice-service';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-invoice-total',
  imports: [CurrencyPipe],
  templateUrl: './invoice-total.component.html',
  styleUrl: './invoice-total.component.css',
})
export class InvoiceTotalComponent {
  @Input() invoice!: Invoice;

  constructor(private invoiceService: InvoiceService) {}

  get total(): number {
    return this.invoiceService.getInvoiceTotal(this.invoice);
  }
}
