import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { AssignmentService } from '../../../core/services/assignment.service';
import { Assignment } from '../../../core/models/assignment.model';
import { Pagination } from '../../../core/models/api-response.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-assignment-list',
  imports: [RouterLink, FormsModule, PaginationComponent, DatePipe],
  templateUrl: './assignment-list.component.html',
  styleUrl: './assignment-list.component.css'
})
export class AssignmentListComponent implements OnInit {
  private service = inject(AssignmentService);

  assignments = signal<Assignment[]>([]);
  pagination = signal<Pagination | null>(null);
  loading = signal(false);
  error = signal('');
  successMessage = signal('');
  filterActive = signal('');
  returnId = signal<number | null>(null);
  returnLoading = signal(false);

  ngOnInit(): void { this.load(1); }

  load(page: number): void {
    this.loading.set(true);
    const active = this.filterActive() === '' ? undefined : this.filterActive() === 'true';
    this.service.getAll(page, 10, active).subscribe({
      next: res => { this.assignments.set(res.data); this.pagination.set(res.pagination); this.loading.set(false); },
      error: err => { this.error.set(err.error?.message ?? 'Erreur de chargement.'); this.loading.set(false); }
    });
  }

  confirmReturn(id: number): void { this.returnId.set(id); }
  cancelReturn(): void { this.returnId.set(null); }

  doReturn(): void {
    const id = this.returnId();
    if (!id) return;
    this.returnLoading.set(true);
    this.service.returnEquipment(id, { date_retour: new Date().toISOString().split('T')[0] }).subscribe({
      next: () => {
        this.returnId.set(null); this.returnLoading.set(false);
        this.successMessage.set('Retour enregistré avec succès.');
        this.load(this.pagination()?.page ?? 1);
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: err => {
        this.error.set(err.error?.message ?? 'Erreur lors du retour.');
        this.returnLoading.set(false); this.returnId.set(null);
      }
    });
  }
}
