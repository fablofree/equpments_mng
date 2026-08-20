import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardStats } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  stats = signal<DashboardStats | null>(null);
  loading = signal(true);
  error = signal('');

  ngOnInit(): void {
    this.dashboardService.getStatistics().subscribe({
      next: res => {
        if (res.success && res.data) this.stats.set(res.data);
        else this.error.set(res.message);
        this.loading.set(false);
      },
      error: err => {
        this.error.set(err.error?.message ?? 'Impossible de charger les statistiques.');
        this.loading.set(false);
      }
    });
  }
}
