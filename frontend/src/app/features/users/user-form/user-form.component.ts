import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule, RouterLink, NgIf],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  editId: number | null = null;
  loading = false;
  saving = false;
  error = '';

  form = this.fb.group({
    nom: ['', Validators.required],
    prenom: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.minLength(6)]
  });

  get isEdit(): boolean { return !!this.editId; }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.editId = +id;
      this.loading = true;
      this.userService.getById(this.editId).subscribe({
        next: res => {
          if (res.success && res.data) {
            this.form.patchValue(res.data);
          }
          this.loading = false;
        },
        error: () => { this.error = 'Utilisateur introuvable.'; this.loading = false; }
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
    this.saving = true;
    this.error = '';

    const raw = this.form.value;
    const payload: any = { nom: raw.nom, prenom: raw.prenom, email: raw.email };
    if (raw.password) payload.password = raw.password;

    const req = this.isEdit
      ? this.userService.update(this.editId!, payload)
      : this.userService.create(payload);

    req.subscribe({
      next: res => {
        if (res.success) {
          this.router.navigate(['/users']);
        } else {
          this.error = res.message;
          this.saving = false;
        }
      },
      error: err => {
        this.error = err.error?.message ?? 'Une erreur est survenue.';
        this.saving = false;
      }
    });
  }
}
