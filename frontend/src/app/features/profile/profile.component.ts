import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  auth = inject(AuthService);
  private fb = inject(FormBuilder);

  saving = false;
  success = '';
  error = '';

  form = this.fb.group({
    prenom: [this.auth.currentUser()?.prenom ?? '', Validators.required],
    nom: [this.auth.currentUser()?.nom ?? '', Validators.required],
    email: [this.auth.currentUser()?.email ?? '', [Validators.required, Validators.email]],
    password: ['', Validators.minLength(6)]
  });

  get initials(): string {
    const u = this.auth.currentUser();
    if (!u) return '?';
    return `${u.prenom[0]}${u.nom[0]}`.toUpperCase();
  }

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving = true;
    this.success = '';
    this.error = '';

    const raw = this.form.value;
    const payload: any = { nom: raw.nom, prenom: raw.prenom, email: raw.email };
    if (raw.password) payload.password = raw.password;

    this.auth.updateProfile(payload).subscribe({
      next: res => {
        if (res.success) {
          this.success = 'Profil mis à jour avec succès.';
          this.form.patchValue({ password: '' });
        } else {
          this.error = res.message;
        }
        this.saving = false;
      },
      error: err => {
        this.error = err.error?.message ?? 'Une erreur est survenue.';
        this.saving = false;
      }
    });
  }
}
