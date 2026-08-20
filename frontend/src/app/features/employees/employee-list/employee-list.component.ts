import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../core/models/employee.model';
import { Pagination } from '../../../core/models/api-response.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink, FormsModule, PaginationComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  private service = inject(EmployeeService);

  employees = signal<Employee[]>([]);
  pagination = signal<Pagination | null>(null);
  loading = signal(false);
  error = signal('');
  successMessage = signal('');
  searchQuery = signal('');
  deleteId = signal<number | null>(null);
  deleteLoading = signal(false);

  private search$ = new Subject<string>();

  ngOnInit(): void {
    this.load(1);
    this.search$.pipe(
      debounceTime(350), distinctUntilChanged(),
      switchMap(q => { this.loading.set(true); return this.service.getAll(1, 10, q); })
    ).subscribe({
      next: res => { this.employees.set(res.data); this.pagination.set(res.pagination); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  load(page: number): void {
    this.loading.set(true);
    this.service.getAll(page, 10, this.searchQuery()).subscribe({
      next: res => { this.employees.set(res.data); this.pagination.set(res.pagination); this.loading.set(false); },
      error: err => { this.error.set(err.error?.message ?? 'Erreur de chargement.'); this.loading.set(false); }
    });
  }

  onSearch(): void { this.search$.next(this.searchQuery()); }
  confirmDelete(id: number): void { this.deleteId.set(id); }
  cancelDelete(): void { this.deleteId.set(null); }

  doDelete(): void {
    const id = this.deleteId();
    if (!id) return;
    this.deleteLoading.set(true);
    this.service.delete(id).subscribe({
      next: () => {
        this.deleteId.set(null); this.deleteLoading.set(false);
        this.successMessage.set('Employé supprimé.');
        this.load(this.pagination()?.page ?? 1);
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: err => {
        this.error.set(err.error?.message ?? 'Suppression impossible.');
        this.deleteLoading.set(false); this.deleteId.set(null);
      }
    });
  }
}
