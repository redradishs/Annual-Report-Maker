import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, EventEmitter, Output, input } from '@angular/core';


@Component({
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pagination.component.html',
  styleUrl: './pagination.component.css'
})
export class PaginationComponent implements OnInit {
  @Input() totalPages: number = 1;
  @Input() currentPage: number = 1;
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  visibleRangeLength: number = 5;
  visiblePages: number[] = [];

  ngOnInit(): void {
    this.updateVisiblePages();
  }

  selectPage(page: number): void {
    this.currentPage = page;
    this.updateVisiblePages();
    this.pageChange.emit(this.currentPage);
  }

  private updateVisiblePages(): void {
    const length = Math.min(this.totalPages, this.visibleRangeLength);
    const startIndex = Math.max(
      Math.min(
        this.currentPage - Math.ceil(length / 2),
        this.totalPages - length
      ),
      0
    );
    this.visiblePages = Array.from(
      { length: length },
      (_, i) => i + startIndex + 1
    );
  }
}