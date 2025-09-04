import { Component, OnDestroy, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { TasksApiService } from '../../../../core/services/tasks-api.service';
import { NotificationService } from '../../../../core/services/notification.service';
import { UiEventsService } from '../../../../core/services/ui-events.service';
import { Task } from '../../../../shared/models/task';
import { TaskState } from '../../../../shared/models/task-state';
import { PagedResult } from '../../../../shared/models/paged-result';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog.component';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { TaskListComponent } from '../../components/task-list/task-list.component';
import { AddTaskDialogComponent } from '../../components/add-task-dialog/add-task-dialog.component';
import { UpdateStatusDialogComponent } from '../../components/update-status-dialog/update-status-dialog.component';
import { User } from '../../../../shared/models/User';
import { UsersApiService } from '../../../../core/services/Users-api.service';

type SortBy = 'id' | 'title' | 'assignedTo' | 'status' | 'createdAtUtc' | 'updatedAtUtc';
type SortDir = 'asc' | 'desc';

@Component({
  selector: 'app-tasks-page',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    TaskListComponent,
    FormsModule,
    MatExpansionModule
  ],
  templateUrl: './tasks.page.html',
  styleUrls: ['./tasks.page.scss']
})
export class TasksPageComponent implements OnDestroy, OnInit {
  private api = inject(TasksApiService);
  private userApi = inject(UsersApiService);
  private notify = inject(NotificationService);
  private dialog = inject(MatDialog);
  private ui = inject(UiEventsService);

  private sub?: Subscription;

  // Etat
  tasks = signal<Task[]>([]);
  loading = signal<boolean>(false);

  // Pagination
  page = signal<number>(1);
  pageSize = signal<number>(10);
  total = signal<number>(0);
  totalPages = signal<number>(1);
  pageSizeValue: number = 10;

  // Filtres
  q: string = '';
  statusFilter: TaskState | null = null;
  assignedTo: string = '';

  // Tri
  sortBy = signal<SortBy>('createdAtUtc'); // par défaut récents d'abord
  sortDir = signal<SortDir>('desc');

  // Numéros de pages (fenêtre autour de la page courante)
  pageNumbers = computed(() => {
    const pages: number[] = [];
    const total = this.totalPages();
    if (total <= 1) return [1];
    const current = this.page();
    const window = 2; // montre p-2 ... p+2
    const start = Math.max(1, current - window);
    const end = Math.min(total, current + window);
    for (let i = start; i <= end; i++) pages.push(i);
    // étendre un peu pour 1 et dernier si pas déjà présents
    if (!pages.includes(1)) pages.unshift(1);
    if (!pages.includes(total)) pages.push(total);
    return Array.from(new Set(pages));
  });
  users: User[] = [];

  constructor() {
    this.load();
    this.sub = this.ui.addTaskRequested$.subscribe(() => this.openAddDialog());
  }

  ngOnInit(): void {
    this.loading.set(true);
    this.userApi.getAll().subscribe({
      next: users => { this.users = users; this.loading.set(false); },
      error: _ => { this.loading.set(false); }
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  private load(): void {
    this.loading.set(true);

    this.api.getAll(
      this.page(),
      this.pageSize(),
      this.sortBy(),
      this.sortDir(),
      this.q?.trim() || undefined,
      this.statusFilter ?? undefined,
      this.assignedTo,
    ).subscribe({
      next: (res: PagedResult<Task>) => {
        this.tasks.set(res.items);
        this.total.set(res.total);
        this.totalPages.set(res.totalPages);
        // Ajuster page si on a dépassé (ex: filtre réduit le total)
        if (this.page() > this.totalPages()) {
          this.page.set(Math.max(1, this.totalPages()));
          // relance un load si on a corrigé la page
          this.api.getAll(
            this.page(),
            this.pageSize(),
            this.sortBy(),
            this.sortDir(),
            this.q?.trim() || undefined,
            this.statusFilter ?? undefined,
            this.assignedTo,
          ).subscribe(r2 => {
            this.tasks.set(r2.items);
            this.total.set(r2.total);
            this.totalPages.set(r2.totalPages);
            this.loading.set(false);
          });
        } else {
          this.loading.set(false);
        }
      },
      error: _ => {
        this.notify.error('Erreur de chargement des tâches');
        this.loading.set(false);
      }
    });
  }

  // Filtres
  applyFilters() {
    this.page.set(1);
    this.load();
  }
  resetFilters() {
    this.q = '';
    this.statusFilter = null;
    this.assignedTo = '';
    this.page.set(1);
    this.load();
  }

  // Tri
  setSort(column: SortBy) {
    if (this.sortBy() === column) {
      this.sortDir.set(this.sortDir() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortBy.set(column);
      this.sortDir.set('asc');
    }
    this.page.set(1);
    this.load();
  }

  // Création
  openAddDialog() {
    const ref = this.dialog.open(AddTaskDialogComponent, { width: '560px' });
    ref.afterClosed().subscribe(payload => {
      if (!payload) return;
      this.api.create(payload).subscribe({
        next: created => {
          this.load();
          this.notify.success('Tâche créée');
        },
        error: _ => this.notify.error('Erreur lors de la création')
      });
    });
  }

  // Update statut
  openUpdateStatusDialog(task: Task) {
    const ref = this.dialog.open(UpdateStatusDialogComponent, {
      width: '420px',
      data: { current: task.status as TaskState }
    });
    ref.afterClosed().subscribe((newStatus?: TaskState) => {
      if (newStatus == null || newStatus === task.status) return;
      this.api.updateStatus(task.id, { status: newStatus, rowVersion: task.rowVersion }).subscribe({
        next: updated => {
          this.load();
          this.notify.success('Statut modifié');
        },
        error: err => {
          if (err?.status === 409) {
            this.notify.info('Conflit de version : rechargement');
            this.load();
          } else {
            this.notify.error('Erreur lors de la mise à jour');
          }
        }
      });
    });
  }

  // Suppression
  confirmDelete(task: Task) {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '460px',
      data: {
        title: 'Supprimer la tâche',
        message: `Confirmer la suppression de « ${task.title} » ?`,
        confirmText: 'Supprimer',
        cancelText: 'Annuler'
      }
    });
    ref.afterClosed().subscribe(yes => {
      if (!yes) return;
      this.api.softDelete(task.id).subscribe({
        next: _ => {
          this.tasks.update(list => list.filter(t => t.id !== task.id));
          this.total.update(t => Math.max(0, t - 1));
          if (this.tasks().length === 0 && this.page() > 1) {
            this.page.update(p => p - 1);
            this.load();
          }
          this.notify.info('Tâche supprimée');
        },
        error: _ => this.notify.error('Erreur lors de la suppression')
      });
    });
  }

  addTask() { this.ui.requestAddTask(); }

  // Pagination
  goTo(p: number) { if (p >= 1 && p <= this.totalPages()) { this.page.set(p); this.load(); } }
  next() { if (this.page() < this.totalPages()) { this.page.update(p => p + 1); this.load(); } }
  prev() { if (this.page() > 1) { this.page.update(p => p - 1); this.load(); } }
  changePageSize() { this.pageSize.set(this.pageSizeValue); this.page.set(1); this.load(); }

  // Expose enum au template si besoin
  TaskState = TaskState;
}
