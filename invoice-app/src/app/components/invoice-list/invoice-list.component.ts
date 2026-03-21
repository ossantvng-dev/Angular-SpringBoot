import { Component, OnInit } from '@angular/core';
import { InvoiceService } from '../../services/invoice-service';
import { Invoice } from '../../models/invoice';
import { InvoiceCardComponent } from '../invoice-card/invoice-card.component';
import { PaginationComponent } from '../../shared/pagination/pagination.component';

@Component({
  selector: 'app-invoice-list',
  imports: [InvoiceCardComponent, PaginationComponent],
  templateUrl: './invoice-list.component.html',
  styleUrl: './invoice-list.component.css',
})
export class InvoiceListComponent implements OnInit {

  invoices: Invoice[] = [];

  currentPage: number = 1;

  itemsPerPage: number = 5;

  constructor(private invoiceService: InvoiceService) {}

  ngOnInit(): void {
    this.invoices = this.invoiceService.getInvoices();
  }

  get totalPages(): number {
    return Math.ceil(this.invoices.length / this.itemsPerPage);
  }

  get paginatedInvoices() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.invoices.slice(start, start + this.itemsPerPage);
  }

  changeItemsPerPage(value: number) {
    this.itemsPerPage = value;
    this.currentPage = 1;
  }

  changePage(page: number) {
    this.currentPage = page;
  }
}
