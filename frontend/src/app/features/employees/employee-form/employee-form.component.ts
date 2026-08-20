import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EmployeeService } from '../../../core/services/employee.service';

@Component({
  selector: 'app-employee-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './employee-form.component.html',
  styleUrl: './employee-form.component.css'
})
export class EmployeeFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(EmployeeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  editId = signal<number | null>(null);
  loading = signal(false);
  saving = signal(false);
  error = signal('');

  form = this.fb.group({
    prenom: ['', Validators.required],
    nom: ['', Validators.required],
    service: ['', Validators.required],
    telephone: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]]
  });

  get isEdit(): boolean { return !!this.editId(); }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId.set(+id);
      this.loading.set(true);
      this.service.getById(+id).subscribe({
        next: res => { if (res.success && res.data) this.form.patchValue(res.data); this.loading.set(false); },
        error: () => { this.error.set('Employé introuvable.'); this.loading.set(false); }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true); this.error.set('');
    const payload = this.form.value as any;
    const req = this.isEdit ? this.service.update(this.editId()!, payload) : this.service.create(payload);
    req.subscribe({
      next: res => { if (res.success) this.router.navigate(['/employees']); else { this.error.set(res.message); this.saving.set(false); } },
      error: err => { this.error.set(err.error?.message ?? 'Erreur.'); this.saving.set(false); }
    });
  }
}
