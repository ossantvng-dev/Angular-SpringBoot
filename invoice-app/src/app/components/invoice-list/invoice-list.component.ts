import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice-service';
import { Invoice } from '../../models/invoice';
import { InvoiceCardComponent } from '../invoice-card/invoice-card.component';

@Component({
  selector: 'app-invoice-list',
  imports: [InvoiceCardComponent],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.css',
})
export class InvoiceListComponent implements OnInit {
  invoices: Invoice[] = [];

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.invoices = this.invoiceService.getInvoices();
  }
}
