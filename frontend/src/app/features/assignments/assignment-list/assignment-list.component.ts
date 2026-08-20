import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AssignmentService } from '../../../core/services/assignment.service';
import { Assignment } from '../../../core/models/assignment.model';
import { Pagination } from '../../../core/models/api-response.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-assignment-list',
  imports: [RouterLink, NgFor, NgIf, FormsModule, PaginationComponent, DatePipe],
  templateUrl: './assignment-list.component.html',
  styleUrl: './assignment-list.component.css'
})
export class AssignmentListComponent implements OnInit {
  private service = inject(AssignmentService);

  assignments: Assignment[] = [];
  pagination!: Pagination;
  loading = false;
  error = '';
  filterActive: string = '';
  returnId: number | null = null;
  returnLoading = false;
  successMessage = '';

  ngOnInit(): void {
    this.load(1);
  }

  load(page: number): void {
    this.loading = true;
    const active = this.filterActive === '' ? undefined : this.filterActive === 'true';
    this.service.getAll(page, 10, active).subscribe({
      next: res => { this.assignments = res.data; this.pagination = res.pagination; this.loading = false; },
      error: () => { this.error = 'Erreur de chargement.'; this.loading = false; }
    });
  }

  confirmReturn(id: number): void { this.returnId = id; }
  cancelReturn(): void { this.returnId = null; }

  doReturn(): void {
    if (!this.returnId) return;
    this.returnLoading = true;
    this.service.returnEquipment(this.returnId, { date_retour: new Date().toISOString().split('T')[0] }).subscribe({
      next: () => {
        this.returnId = null;
        this.returnLoading = false;
        this.successMessage = 'Retour enregistré avec succès.';
        this.load(this.pagination?.page ?? 1);
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: err => {
        this.error = err.error?.message ?? 'Erreur lors du retour.';
        this.returnLoading = false;
        this.returnId = null;
      }
    });
  }
}
