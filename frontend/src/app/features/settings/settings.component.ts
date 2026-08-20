import { Component, inject, signal, ElementRef, viewChild } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AppSettingsService } from '../../core/services/app-settings.service';
import { AppSettings } from '../../core/models/app-settings.model';

@Component({
  selector: 'app-settings',
  imports: [ReactiveFormsModule],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css'
})
export class SettingsComponent {
  private fb = inject(FormBuilder);
  appSettings = inject(AppSettingsService);

  fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  saving = signal(false);
  success = signal('');
  logoPreview = signal<string | null>(this.appSettings.settings().logoDataUrl);
  uploadError = signal('');

  form = this.fb.group({
    appName:      [this.appSettings.settings().appName,      Validators.required],
    tagline:      [this.appSettings.settings().tagline,      []],
    primaryColor: [this.appSettings.settings().primaryColor, Validators.required],
    companyName:  [this.appSettings.settings().companyName,  []],
    contactEmail: [this.appSettings.settings().contactEmail, [Validators.email]],
    contactPhone: [this.appSettings.settings().contactPhone, []]
  });

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      this.uploadError.set('Veuillez sélectionner un fichier image (PNG, JPG, SVG…).');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      this.uploadError.set('Le fichier ne doit pas dépasser 2 Mo.');
      return;
    }
    this.uploadError.set('');
    const reader = new FileReader();
    reader.onload = () => this.logoPreview.set(reader.result as string);
    reader.readAsDataURL(file);
  }

  removeLogo(): void {
    this.logoPreview.set(null);
    const input = this.fileInput();
    if (input) input.nativeElement.value = '';
  }

  save(): void {
    if (this.form.invalid) { this.form.markAllAsTouched(); return; }
    this.saving.set(true);
    this.success.set('');

    const updated: AppSettings = {
      appName:      this.form.value.appName!,
      tagline:      this.form.value.tagline ?? '',
      primaryColor: this.form.value.primaryColor!,
      companyName:  this.form.value.companyName ?? '',
      contactEmail: this.form.value.contactEmail ?? '',
      contactPhone: this.form.value.contactPhone ?? '',
      logoDataUrl:  this.logoPreview()
    };

    this.appSettings.save(updated);
    this.success.set('Paramètres enregistrés avec succès.');
    this.saving.set(false);
    setTimeout(() => this.success.set(''), 4000);
  }

  reset(): void {
    this.appSettings.reset();
    const def = this.appSettings.settings();
    this.form.patchValue(def);
    this.logoPreview.set(null);
    this.success.set('Paramètres réinitialisés.');
    setTimeout(() => this.success.set(''), 3000);
  }
}
