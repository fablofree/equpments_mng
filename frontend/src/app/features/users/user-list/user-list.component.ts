import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subject, switchMap } from 'rxjs';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';
import { Pagination } from '../../../core/models/api-response.model';
import { PaginationComponent } from '../../../shared/components/pagination/pagination.component';

@Component({
  selector: 'app-user-list',
  imports: [RouterLink, FormsModule, PaginationComponent],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);

  users = signal<User[]>([]);
  pagination = signal<Pagination | null>(null);
  loading = signal(false);
  error = signal('');
  successMessage = signal('');
  searchQuery = signal('');
  deleteId = signal<number | null>(null);
  deleteLoading = signal(false);

  private search$ = new Subject<string>();

  ngOnInit(): void {
    this.load(1);
    this.search$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      switchMap(q => { this.loading.set(true); return this.userService.getAll(1, 10, q); })
    ).subscribe({
      next: res => { this.users.set(res.data); this.pagination.set(res.pagination); this.loading.set(false); },
      error: () => this.loading.set(false)
    });
  }

  load(page: number): void {
    this.loading.set(true);
    this.userService.getAll(page, 10, this.searchQuery()).subscribe({
      next: res => { this.users.set(res.data); this.pagination.set(res.pagination); this.loading.set(false); },
      error: err => { this.error.set(err.error?.message ?? 'Erreur de chargement.'); this.loading.set(false); }
    });
  }

  onSearch(): void { this.search$.next(this.searchQuery()); }

  confirmDelete(id: number): void { this.deleteId.set(id); }
  cancelDelete(): void { this.deleteId.set(null); }

  doDelete(): void {
    const id = this.deleteId();
    if (!id) return;
    this.deleteLoading.set(true);
    this.userService.delete(id).subscribe({
      next: () => {
        this.deleteId.set(null);
        this.deleteLoading.set(false);
        this.successMessage.set('Utilisateur supprimé.');
        this.load(this.pagination()?.page ?? 1);
        setTimeout(() => this.successMessage.set(''), 3000);
      },
      error: err => {
        this.error.set(err.error?.message ?? 'Suppression impossible.');
        this.deleteLoading.set(false);
        this.deleteId.set(null);
      }
    });
  }
}
