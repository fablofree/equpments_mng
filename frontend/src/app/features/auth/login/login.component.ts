import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AppSettingsService } from '../../../core/services/app-settings.service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private router = inject(Router);
  appSettings = inject(AppSettingsService);

  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  loading = signal(false);
  error = signal('');
  showPassword = signal(false);

  submit(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.loading.set(true);
    this.error.set('');
    const { email, password } = this.form.value;

    this.auth.login(email!, password!).subscribe({
      next: res => {
        if (res.success) this.router.navigate(['/dashboard']);
        else { this.error.set(res.message); this.loading.set(false); }
      },
      error: err => {
        this.error.set(err.error?.message ?? 'Erreur de connexion. Vérifiez vos identifiants.');
        this.loading.set(false);
      }
    });
  }
}
