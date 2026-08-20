import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { AssignmentService } from '../../../core/services/assignment.service';
import { EmployeeService } from '../../../core/services/employee.service';
import { EquipmentService } from '../../../core/services/equipment.service';
import { Employee } from '../../../core/models/employee.model';
import { Equipment } from '../../../core/models/equipment.model';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-assignment-form',
  imports: [ReactiveFormsModule, RouterLink, NgFor, NgIf],
  templateUrl: './assignment-form.component.html',
  styleUrl: './assignment-form.component.css'
})
export class AssignmentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(AssignmentService);
  private employeeService = inject(EmployeeService);
  private equipmentService = inject(EquipmentService);
  private router = inject(Router);

  employees: Employee[] = [];
  availableEquipments: Equipment[] = [];
  loading = true;
  saving = false;
  error = '';

  form = this.fb.group({
    employe_id: [null as number | null, Validators.required],
    equipement_id: [null as number | null, Validators.required],
    date_affectation: [new Date().toISOString().split('T')[0], Validators.required]
  });

  ngOnInit(): void {
    forkJoin({
      employees: this.employeeService.getAll(1, 1000),
      equipments: this.equipmentService.getAll(1, 1000, '', 'disponible')
    }).subscribe({
      next: ({ employees, equipments }) => {
        this.employees = employees.data;
        this.availableEquipments = equipments.data;
        this.loading = false;
      },
      error: () => { this.error = 'Impossible de charger les données.'; this.loading = false; }
    });
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.error = '';
    const { employe_id, equipement_id, date_affectation } = this.form.value;

    this.service.create({
      employe_id: employe_id!,
      equipement_id: equipement_id!,
      date_affectation: date_affectation!
    }).subscribe({
      next: res => {
        if (res.success) this.router.navigate(['/assignments']);
        else { this.error = res.message; this.saving = false; }
      },
      error: err => { this.error = err.error?.message ?? 'Erreur.'; this.saving = false; }
    });
  }
}
