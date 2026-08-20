import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { EquipmentService } from '../../../core/services/equipment.service';
import { Equipment, EquipmentStatus } from '../../../core/models/equipment.model';
import { Pagination } from '../../../core/models/api-response.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { StatusLabelPipe } from '../../../shared/pipes/status-label.pipe';

@Component({
  selector: 'app-equipment-list',
  imports: [RouterLink, FormsModule, PaginationComponent, StatusLabelPipe],
  templateUrl: './equipment-list.component.html',
  styleUrl: './equipment-list.component.css'
})
export class EquipmentListComponent implements OnInit {
  private service = inject(EquipmentService);

  equipments = signal<Equipment[]>([]);
  pagination = signal<Pagination | null>(null);
  loading = signal(false);
  error = signal('');
  successMessage = signal('');
  searchQuery = signal('');
  filterEtat = signal<EquipmentStatus | ''>('');
  deleteId = signal<number | null>(null);
  deleteLoading = signal(false);

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
      debounceTime(350), distinctUntilChanged(),
      switchMap(() => { this.loading.set(true); return this.fetchPage(1); })
    ).subscribe({
      next: res => { this.equipments.set(res.data); this.pagination.set(res.pagination); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  private fetchPage(page: number) {
    return this.service.getAll(page, 10, this.searchQuery(), this.filterEtat() || undefined);
  }

  load(page: number): void {
    this.loading.set(true);
    this.fetchPage(page).subscribe({
      next: res => { this.equipments.set(res.data); this.pagination.set(res.pagination); this.loading.set(false); },
      error: err => { this.error.set(err.error?.message ?? 'Erreur de chargement.'); this.loading.set(false); }
    });
  }

  onSearch(): void { this.search$.next(); }

  statusClass(etat: EquipmentStatus): string { return `badge-${etat}`; }

  confirmDelete(id: number): void { this.deleteId.set(id); }
  cancelDelete(): void { this.deleteId.set(null); }

  doDelete(): void {
    const id = this.deleteId();
    if (!id) return;
    this.deleteLoading.set(true);
    this.service.delete(id).subscribe({
      next: () => {
        this.deleteId.set(null); this.deleteLoading.set(false);
        this.successMessage.set('Équipement supprimé.');
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
