import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { EmployeeService } from '../../../core/services/employee.service';
import { AssignmentService } from '../../../core/services/assignment.service';
import { Employee } from '../../../core/models/employee.model';
import { Assignment } from '../../../core/models/assignment.model';
import { Pagination } from '../../../core/models/api-response.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-employee-detail',
  imports: [RouterLink, DatePipe, PaginationComponent],
  templateUrl: './employee-detail.component.html',
  styleUrl: './employee-detail.component.css'
})
export class EmployeeDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private employeeService = inject(EmployeeService);
  private assignmentService = inject(AssignmentService);

  employee = signal<Employee | null>(null);
  assignments = signal<Assignment[]>([]);
  assignmentPagination = signal<Pagination | null>(null);
  loading = signal(true);
  historyLoading = signal(false);
  error = signal('');

  private employeeId = 0;

  ngOnInit(): void {
    this.employeeId = Number(this.route.snapshot.paramMap.get('id'));
    if (!this.employeeId) { this.router.navigate(['/employees']); return; }

    this.employeeService.getById(this.employeeId).subscribe({
      next: res => {
        if (res.success && res.data) {
          this.employee.set(res.data);
          this.loadHistory(1);
        } else {
          this.error.set('Employé introuvable.');
          this.loading.set(false);
        }
      },
      error: () => { this.error.set('Employé introuvable.'); this.loading.set(false); }
    });
  }

  loadHistory(page: number): void {
    this.historyLoading.set(true);
    this.assignmentService.getByEmployeeId(this.employeeId, page).subscribe({
      next: res => {
        this.assignments.set(res.data ?? []);
        this.assignmentPagination.set(res.pagination ?? null);
        this.historyLoading.set(false);
        this.loading.set(false);
      },
      error: () => { this.historyLoading.set(false); this.loading.set(false); }
    });
  }

  initials(): string {
    const emp = this.employee();
    if (!emp) return '?';
    return `${emp.prenom.charAt(0)}${emp.nom.charAt(0)}`.toUpperCase();
  }
}
