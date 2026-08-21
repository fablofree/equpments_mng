import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AssignmentService } from '../../../core/services/assignment.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { EquipmentService } from '../../../core/services/equipment.service';
import { Employee } from '../../../core/models/employee.model';
import { Equipment } from '../../../core/models/equipment.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-assignment-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './assignment-form.component.html',
  styleUrl: './assignment-form.component.css'
})
export class AssignmentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(AssignmentService);
  private employeeService = inject(EmployeeService);
  private equipmentService = inject(EquipmentService);
  private router = inject(Router);

  employees = signal<Employee[]>([]);
  availableEquipments = signal<Equipment[]>([]);
  loading = signal(true);
  saving = signal(false);
  error = signal('');

  form = this.fb.group({
    employe_id: [null as number | null, Validators.required],
    equipement_id: [null as number | null, Validators.required],
    date_affectation: [new Date().toISOString().split('T')[0], Validators.required],
    date_retour: [null as string | null]
  });

  ngOnInit(): void {
    forkJoin({
      employees: this.employeeService.getAll(1, 1000),
      equipments: this.equipmentService.getAll(1, 1000, '', 'disponible')
    }).subscribe({
      next: ({ employees, equipments }) => {
        this.employees.set(employees.data);
        this.availableEquipments.set(equipments.data);
        this.loading.set(false);
      },
      error: err => { this.error.set(err.error?.message ?? 'Impossible de charger les données.'); this.loading.set(false); }
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true); this.error.set('');
    const { employe_id, equipement_id, date_affectation, date_retour } = this.form.value;
    const payload: any = {
      employe_id: employe_id!,
      equipement_id: equipement_id!,
      date_affectation: date_affectation!
    };
    if (date_retour) payload.date_retour = date_retour;
    this.service.create(payload).subscribe({
      next: res => { if (res.success) this.router.navigate(['/assignments']); else { this.error.set(res.message); this.saving.set(false); } },
      error: err => { this.error.set(err.error?.message ?? 'Erreur.'); this.saving.set(false); }
    });
  }
}
