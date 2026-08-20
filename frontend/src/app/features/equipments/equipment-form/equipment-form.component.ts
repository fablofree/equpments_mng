import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { EquipmentService } from '../../../core/services/equipment.service';
import { EquipmentStatus } from '../../../core/models/equipment.model';

@Component({
  selector: 'app-equipment-form',
  imports: [ReactiveFormsModule, RouterLink, NgFor, NgIf],
  templateUrl: './equipment-form.component.html',
  styleUrl: './equipment-form.component.css'
})
export class EquipmentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(EquipmentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  editId: number | null = null;
  loading = false;
  saving = false;
  error = '';

  readonly statusOptions: { value: EquipmentStatus; label: string }[] = [
    { value: 'disponible', label: 'Disponible' },
    { value: 'affecte', label: 'Affecté' },
    { value: 'maintenance', label: 'En maintenance' },
    { value: 'hors_service', label: 'Hors service' }
  ];

  form = this.fb.group({
    reference: ['', Validators.required],
    nom: ['', Validators.required],
    categorie: ['', Validators.required],
    marque: ['', Validators.required],
    date_achat: ['', Validators.required],
    etat: ['disponible' as EquipmentStatus, Validators.required]
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
        error: () => { this.error = 'Équipement introuvable.'; this.loading = false; }
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
        if (res.success) this.router.navigate(['/equipments']);
        else { this.error = res.message; this.saving = false; }
      },
      error: err => { this.error = err.error?.message ?? 'Erreur.'; this.saving = false; }
    });
  }
}
