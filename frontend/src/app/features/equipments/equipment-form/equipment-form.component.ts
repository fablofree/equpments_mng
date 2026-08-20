import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { EquipmentService } from '../../../core/services/equipment.service';
import { EquipmentStatus } from '../../../core/models/equipment.model';

@Component({
  selector: 'app-equipment-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './equipment-form.component.html',
  styleUrl: './equipment-form.component.css'
})
export class EquipmentFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private service = inject(EquipmentService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  editId = signal<number | null>(null);
  loading = signal(false);
  saving = signal(false);
  error = signal('');

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

  get isEdit(): boolean { return !!this.editId(); }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId.set(+id);
      this.loading.set(true);
      this.service.getById(+id).subscribe({
        next: res => { if (res.success && res.data) this.form.patchValue(res.data); this.loading.set(false); },
        error: () => { this.error.set('Équipement introuvable.'); this.loading.set(false); }
      });
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true); this.error.set('');
    const payload = this.form.value as any;
    const req = this.isEdit ? this.service.update(this.editId()!, payload) : this.service.create(payload);
    req.subscribe({
      next: res => { if (res.success) this.router.navigate(['/equipments']); else { this.error.set(res.message); this.saving.set(false); } },
      error: err => { this.error.set(err.error?.message ?? 'Erreur.'); this.saving.set(false); }
    });
  }
}
