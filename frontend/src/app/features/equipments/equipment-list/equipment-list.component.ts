import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { EquipmentService } from '../../../core/services/equipment.service';
import { Equipment, EquipmentStatus } from '../../../core/models/equipment.model';
import { Pagination } from '../../../core/models/api-response.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { StatusLabelPipe } from '../../../shared/pipes/status-label.pipe';

@Component({
  selector: 'app-equipment-list',
  imports: [RouterLink, NgFor, NgIf, FormsModule, PaginationComponent, StatusLabelPipe],
  templateUrl: './equipment-list.component.html',
  styleUrl: './equipment-list.component.css'
})
export class EquipmentListComponent implements OnInit {
  private service = inject(EquipmentService);

  equipments: Equipment[] = [];
  pagination!: Pagination;
  loading = false;
  error = '';
  searchQuery = '';
  filterEtat: EquipmentStatus | '' = '';
  deleteId: number | null = null;
  deleteLoading = false;
  successMessage = '';

  readonly statusOptions: { value: EquipmentStatus | ''; label: string }[] = [
    { value: '', label: 'Tous les états' },
    { value: 'disponible', label: 'Disponible' },
    { value: 'affecte', label: 'Affecté' },
    { value: 'maintenance', label: 'Maintenance' },
    { value: 'hors_service', label: 'Hors service' }
  ];

  private search$ = new Subject<void>();

  ngOnInit(): void {
    this.load(1);
    this.search$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(() => { this.loading = true; return this.fetchPage(1); })
    ).subscribe(res => {
      this.equipments = res.data;
      this.pagination = res.pagination;
      this.loading = false;
    });
  }

  private fetchPage(page: number) {
    return this.service.getAll(page, 10, this.searchQuery, this.filterEtat || undefined);
  }

  load(page: number): void {
    this.loading = true;
    this.fetchPage(page).subscribe({
      next: res => { this.equipments = res.data; this.pagination = res.pagination; this.loading = false; },
      error: () => { this.error = 'Erreur de chargement.'; this.loading = false; }
    });
  }

  onSearch(): void { this.search$.next(); }

  statusClass(etat: EquipmentStatus): string {
    return `badge-${etat}`;
  }

  confirmDelete(id: number): void { this.deleteId = id; }
  cancelDelete(): void { this.deleteId = null; }

  doDelete(): void {
    if (!this.deleteId) return;
    this.deleteLoading = true;
    this.service.delete(this.deleteId).subscribe({
      next: () => {
        this.deleteId = null;
        this.deleteLoading = false;
        this.successMessage = 'Équipement supprimé.';
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
