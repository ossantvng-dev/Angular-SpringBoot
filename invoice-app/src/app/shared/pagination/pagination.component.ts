import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css',
})
export class PaginationComponent {

  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  @Input() itemsPerPage: number = 5;
  @Input() itemsPerPageOptions: number[] = [5, 10, 20, 50];

  @Output() pageChange = new EventEmitter<number>();
  @Output() itemsPerPageChange = new EventEmitter<number>();

  next() {
    if (this.currentPage < this.totalPages) {
      this.pageChange.emit(this.currentPage + 1);
    }
  }

  prev() {
    if (this.currentPage > 1) {
      this.pageChange.emit(this.currentPage - 1);
    }
  }

  changeItemsPerPage(value: string) {
    this.itemsPerPageChange.emit(Number(value));
  }

}
