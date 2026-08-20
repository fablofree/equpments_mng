import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppSettingsService } from './core/services/app-settings.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
  styles: []
})
export class App implements OnInit {
  private appSettings = inject(AppSettingsService);

  ngOnInit(): void {
    this.appSettings.applyTheme();
  }
}
