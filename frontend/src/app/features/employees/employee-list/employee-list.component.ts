import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { EmployeeService } from '../../../core/services/employee.service';
import { Employee } from '../../../core/models/employee.model';
import { Pagination } from '../../../core/models/api-response.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-employee-list',
  imports: [RouterLink, NgFor, NgIf, FormsModule, PaginationComponent],
  templateUrl: './employee-list.component.html',
  styleUrl: './employee-list.component.css'
})
export class EmployeeListComponent implements OnInit {
  private service = inject(EmployeeService);

  employees: Employee[] = [];
  pagination!: Pagination;
  loading = false;
  error = '';
  searchQuery = '';
  deleteId: number | null = null;
  deleteLoading = false;
  successMessage = '';

  private search$ = new Subject<string>();

  ngOnInit(): void {
    this.load(1);
    this.search$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(q => { this.loading = true; return this.service.getAll(1, 10, q); })
    ).subscribe(res => {
      this.employees = res.data;
      this.pagination = res.pagination;
      this.loading = false;
    });
  }

  load(page: number): void {
    this.loading = true;
    this.service.getAll(page, 10, this.searchQuery).subscribe({
      next: res => { this.employees = res.data; this.pagination = res.pagination; this.loading = false; },
      error: () => { this.error = 'Erreur de chargement.'; this.loading = false; }
    });
  }

  onSearch(): void { this.search$.next(this.searchQuery); }

  confirmDelete(id: number): void { this.deleteId = id; }
  cancelDelete(): void { this.deleteId = null; }

  doDelete(): void {
    if (!this.deleteId) return;
    this.deleteLoading = true;
    this.service.delete(this.deleteId).subscribe({
      next: () => {
        this.deleteId = null;
        this.deleteLoading = false;
        this.successMessage = 'Employé supprimé.';
        this.load(this.pagination?.page ?? 1);
        setTimeout(() => this.successMessage = '', 3000);
      },
      error: err => {
        this.error = err.error?.message ?? 'Suppression impossible.';
        this.deleteLoading = false;
        this.deleteId = null;
      }
    });
  }
}
