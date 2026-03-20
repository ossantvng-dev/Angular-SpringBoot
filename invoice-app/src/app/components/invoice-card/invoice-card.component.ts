import { Component, Input } from '@angular/core';
import { Invoice } from '../../models/invoice';
import { ClientCardComponent } from '../client-card/client-card.component';
import { CompanyCardComponent } from '../company-card/company-card.component';
import { InvoiceItemsComponent } from '../invoice-items/invoice-items.component';
import { InvoiceTotalComponent } from '../invoice-total/invoice-total.component';

@Component({
  selector: 'app-invoice-card',
  imports: [
    ClientCardComponent,
    CompanyCardComponent,
    InvoiceItemsComponent,
    InvoiceTotalComponent,
  ],
  templateUrl: './invoice-card.component.html',
  styleUrl: './invoice-card.component.css',
})
export class InvoiceCardComponent {
  @Input() invoice!: Invoice;
}
