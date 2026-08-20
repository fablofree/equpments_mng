import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Pagination } from '../../../core/models/api-response.model';

@Component({
  selector: 'app-pagination',
  imports: [],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent {
  @Input() pagination!: Pagination;
  @Output() pageChange = new EventEmitter<number>();

  get pages(): number[] {
    return Array.from({ length: this.pagination.totalPages }, (_, i) => i + 1);
  }

  go(page: number): void {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
