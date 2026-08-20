import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(EmployeeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  editId: number | null = null;
  loading = false;
  saving = false;
  error = '';

  form = this.fb.group({
    prenom: ['', Validators.required],
    nom: ['', Validators.required],
    service: ['', Validators.required],
    telephone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  get isEdit(): boolean { return !!this.editId; }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = +id;
      this.loading = true;
      this.service.getById(this.editId).subscribe({
        next: res => {
          if (res.success && res.data) this.form.patchValue(res.data);
          this.loading = false;
        },
        error: () => { this.error = 'Employé introuvable.'; this.loading = false; }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.error = '';
    const payload = this.form.value as any;

    const req = this.isEdit
      ? this.service.update(this.editId!, payload)
      : this.service.create(payload);

    req.subscribe({
      next: res => {
        if (res.success) this.router.navigate(['/employees']);
        else { this.error = res.message; this.saving = false; }
      },
      error: err => { this.error = err.error?.message ?? 'Erreur.'; this.saving = false; }
    });
  }
}
