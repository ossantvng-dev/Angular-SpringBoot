import { Injectable } from '@angular/core';
import { Invoice } from '../models/invoice';
import { invoices as invoicesMockData } from '../data/invoice.data';

@Injectable({
  providedIn: 'root',
})
export class InvoiceService {

  private invoices: Invoice[] = invoicesMockData;
  
  constructor() {}

  getInvoices(): Invoice[] {
    return this.invoices;
  }
}
