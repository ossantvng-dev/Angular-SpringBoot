import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice-service';
import { Invoice } from '../../models/invoice';

@Component({
  selector: 'app-invoice',
  imports: [],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.css',
})
export class InvoiceComponent implements OnInit {

  invoices!: Invoice[];

  constructor(private invoiceService: InvoiceService) { }

  ngOnInit(): void {
    this.invoices = this.invoiceService.getInvoices();
  }

}
