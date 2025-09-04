import { Component, OnDestroy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';

import { TasksApiService } from '../../core/services/tasks-api.service';
import { NotificationService } from '../../core/services/notification.service';
import { UiEventsService } from '../../core/services/ui-events.service';

import { Task } from '../../shared/models/task';
import { TaskState } from '../../shared/models/task-state';
import { PagedResult } from '../../shared/models/paged-result';

import { TaskListComponent } from './task-list.component';
import { AddTaskDialogComponent } from './add-task-dialog.component';
import { UpdateStatusDialogComponent } from './update-status-dialog.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog.component';
import { Subscription } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';

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
  template: `
    <div class="container">
      <mat-card>
        <div class="header-row">
          <h2>Liste des tâches</h2>
          <span class="spacer"></span>
          <button mat-raised-button color="accent" (click)="addTask()">
            <mat-icon>add</mat-icon>
            Ajouter une tâche
          </button>
        </div>

        <!-- Filtres -->
        <mat-expansion-panel class="filter-panel">
          <mat-expansion-panel-header>
            <mat-panel-title>
              🔍 Filtres de recherche
            </mat-panel-title>
          </mat-expansion-panel-header>
     
          <div class="filters">
            <mat-form-field appearance="outline" class="filter-input">
              <mat-label>Recherche</mat-label>
              <input matInput placeholder="Titre / description" [(ngModel)]="q" (keyup.enter)="applyFilters()">
              <button mat-icon-button matSuffix aria-label="rechercher" (click)="applyFilters()">
                <mat-icon>search</mat-icon>
              </button>
            </mat-form-field>

            <mat-form-field appearance="outline" class="filter-input">
              <mat-label>Statut</mat-label>
              <mat-select [(value)]="statusFilter">
                <mat-option [value]="null">Tous</mat-option>
                <mat-option [value]="TaskState.Todo">À faire</mat-option>
                <mat-option [value]="TaskState.InProgress">En cours</mat-option>
                <mat-option [value]="TaskState.Done">Complété</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="filter-input">
              <mat-label>Assigné à</mat-label>
              <input matInput placeholder="Nom" [(ngModel)]="assignedTo" (keyup.enter)="applyFilters()">
              <button mat-icon-button matSuffix aria-label="filtrer" (click)="applyFilters()">
                <mat-icon>filter_alt</mat-icon>
              </button>
            </mat-form-field>
          </div>

          <!-- Boutons alignés à droite -->
          <div class="button-row">
            <button mat-stroked-button color="primary" (click)="applyFilters()">
              <mat-icon>search</mat-icon>
              Rechercher
            </button>

            <button mat-stroked-button (click)="resetFilters()">
              <mat-icon>restart_alt</mat-icon>
              Réinitialiser
            </button>
          </div>
       
        </mat-expansion-panel>

        <!-- Tri -->
<div class="sorting">
  <span class="sort-label">Trier par :</span>

  <button mat-stroked-button class="small-size-btn"
          [color]="sortBy() === 'title' ? 'primary' : undefined"
          (click)="setSort('title')">
    Titre {{ sortBy() === 'title' ? (sortDir() === 'asc' ? '↑' : '↓') : '' }}
  </button>

  <button mat-stroked-button class="small-size-btn"
          [color]="sortBy() === 'assignedTo' ? 'primary' : undefined"
          (click)="setSort('assignedTo')">
    Assigné à {{ sortBy() === 'assignedTo' ? (sortDir() === 'asc' ? '↑' : '↓') : '' }}
  </button>

  <button mat-stroked-button class="small-size-btn"
          [color]="sortBy() === 'status' ? 'primary' : undefined"
          (click)="setSort('status')">
    Statut {{ sortBy() === 'status' ? (sortDir() === 'asc' ? '↑' : '↓') : '' }}
  </button>

  <button mat-stroked-button class="small-size-btn"
          [color]="sortBy() === 'createdAtUtc' ? 'primary' : undefined"
          (click)="setSort('createdAtUtc')">
    Date de création {{ sortBy() === 'createdAtUtc' ? (sortDir() === 'desc' ? '↑' : '↓') : '' }}
  </button>
</div>


        <!-- Table -->
        <app-task-list
          [tasks]="tasks()"
          (requestUpdateStatus)="openUpdateStatusDialog($event)"
          (requestDelete)="confirmDelete($event)">
        </app-task-list>

        <!-- Pagination bottom -->
        <div class="paginator bottom">
          <button mat-stroked-button (click)="prev()" [disabled]="page()<=1">←</button>

          <ng-container *ngFor="let p of pageNumbers()">
            <button mat-button
                    [color]="p === page() ? 'primary' : undefined"
                    [disabled]="p === page()"
                    (click)="goTo(p)">{{p}}</button>
          </ng-container>

          <button mat-stroked-button (click)="next()" [disabled]="page()>=totalPages()">→</button>

          <span class="total">({{total()}} éléments)</span>

          <mat-form-field appearance="outline" class="size-select">
            <mat-label>Taille</mat-label>
            <mat-select [(value)]="pageSizeValue" (selectionChange)="changePageSize()">
              <mat-option [value]="5">5</mat-option>
              <mat-option [value]="10">10</mat-option>
              <mat-option [value]="20">20</mat-option>
              <mat-option [value]="50">50</mat-option>
            </mat-select>
          </mat-form-field>

        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .container{max-width:1100px;margin:24px auto;display:flex;flex-direction:column;gap:16px;padding-bottom: 34px}
    h2{margin:0 0 12px}
    .sort-label{opacity:.8;margin-right:4px}
    .paginator{display:flex;align-items:center;gap:6px;margin:8px 0;flex-wrap:wrap}
    .paginator .total{margin-left:8px;opacity:.75}
    .paginator .size-select{width:110px;margin-left:auto}
    .paginator.bottom{margin-top:16px}
    .button-row { display: flex; justify-content: flex-end;  gap: 12px;}
    .filters-container { background: #f9f9f9; border: 1px solid #ddd; border-radius: 8px; padding: 16px; margin-bottom: 20px; box-shadow: 0 2px 6px rgba(0,0,0,0.08); } 
    .filters-title { font-size: 18px; font-weight: 600; margin-bottom: 16px; color: mat-primary;} 
    .filter-input { width: 32%;}
    .filters { display: flex; gap: 16px; flex-wrap: wrap; }
    .filter-panel { margin-top: 16px; margin-bottom: 16px; }
    .sorting { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; padding: 0 0 15px 0;} 
    .sorting .spacer { flex: 1;  }
    .small-size-btn {font-size: 10px !important; padding: 0 0.5rem;}
    .header-row { display: flex; align-items: center; margin-bottom: 16px; } 
    .header-row h2 { margin: 0; } 
    .header-row .spacer { flex: 1; }
  `]
})
export class TasksPageComponent implements OnDestroy {
  private api = inject(TasksApiService);
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

  constructor() {
    this.load();
    this.sub = this.ui.addTaskRequested$.subscribe(() => this.openAddDialog());
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
      this.assignedTo?.trim() || undefined,
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
            this.assignedTo?.trim() || undefined,
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
          this.tasks.update(list => list.map(t => t.id === updated.id ? updated : t));
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
