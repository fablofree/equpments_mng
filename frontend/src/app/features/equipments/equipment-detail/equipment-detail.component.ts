import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { EquipmentService } from '../../../core/services/equipment.service';
import { AssignmentService } from '../../../core/services/assignment.service';
import { Equipment } from '../../../core/models/equipment.model';
import { Assignment } from '../../../core/models/assignment.model';
import { Pagination } from '../../../core/models/api-response.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';
import { StatusLabelPipe } from '../../../shared/pipes/status-label.pipe';

@Component({
  selector: 'app-equipment-detail',
  imports: [RouterLink, DatePipe, PaginationComponent, StatusLabelPipe],
  templateUrl: './equipment-detail.component.html',
  styleUrl: './equipment-detail.component.css'
})
export class EquipmentDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private equipmentService = inject(EquipmentService);
  private assignmentService = inject(AssignmentService);

  equipment = signal<Equipment | null>(null);
  assignments = signal<Assignment[]>([]);
  assignmentPagination = signal<Pagination | null>(null);
  loading = signal(true);
  historyLoading = signal(false);
  error = signal('');

  private equipmentId = 0;

  ngOnInit(): void {
    this.equipmentId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.equipmentId) { this.router.navigate(['/equipments']); return; }

    this.equipmentService.getById(this.equipmentId).subscribe({
      next: res => {
        if (res.success && res.data) {
          this.equipment.set(res.data);
          this.loadHistory(1);
        } else {
          this.error.set('Équipement introuvable.');
          this.loading.set(false);
        }
      },
      error: () => { this.error.set('Équipement introuvable.'); this.loading.set(false); }
    });
  }

  loadHistory(page: number): void {
    this.historyLoading.set(true);
    this.assignmentService.getByEquipmentId(this.equipmentId, page).subscribe({
      next: res => {
        this.assignments.set(res.data ?? []);
        this.assignmentPagination.set(res.pagination ?? null);
        this.historyLoading.set(false);
        this.loading.set(false);
      },
      error: () => { this.historyLoading.set(false); this.loading.set(false); }
    });
  }

  statusClass(etat: string): string {
    const map: Record<string, string> = {
      disponible: 'badge-disponible',
      affecte: 'badge-affecte',
      maintenance: 'badge-maintenance',
      hors_service: 'badge-hors_service'
    };
    return map[etat] ?? 'bg-secondary';
  }
}
