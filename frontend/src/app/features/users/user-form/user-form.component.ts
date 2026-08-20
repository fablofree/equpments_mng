import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  editId = signal<number | null>(null);
  loading = signal(false);
  saving = signal(false);
  error = signal('');

  form = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.minLength(6)]
  });

  get isEdit(): boolean { return !!this.editId(); }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId.set(+id);
      this.loading.set(true);
      this.userService.getById(+id).subscribe({
        next: res => {
          if (res.success && res.data) this.form.patchValue(res.data);
          this.loading.set(false);
        },
        error: () => { this.error.set('Utilisateur introuvable.'); this.loading.set(false); }
      });
      this.form.get('password')?.clearValidators();
      this.form.get('password')?.updateValueAndValidity();
    } else {
      this.form.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
      this.form.get('password')?.updateValueAndValidity();
    }
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    this.error.set('');

    const raw = this.form.value;
    const payload: any = { nom: raw.nom, prenom: raw.prenom, email: raw.email };
    if (raw.password) payload.password = raw.password;

    const req = this.isEdit
      ? this.userService.update(this.editId()!, payload)
      : this.userService.create(payload);

    req.subscribe({
      next: res => {
        if (res.success) this.router.navigate(['/users']);
        else { this.error.set(res.message); this.saving.set(false); }
      },
      error: err => { this.error.set(err.error?.message ?? 'Une erreur est survenue.'); this.saving.set(false); }
    });
  }
}
