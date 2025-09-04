import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../../shared/models/task';
import { TaskState } from '../../shared/models/task-state';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  template: `
    <table mat-table [dataSource]="tasks" class="mat-elevation-z1 full">
      <ng-container matColumnDef="title"><th mat-header-cell *matHeaderCellDef>Titre</th><td mat-cell *matCellDef="let t">{{t.title}}</td></ng-container>

      <ng-container matColumnDef="assignedTo"><th mat-header-cell *matHeaderCellDef>Assignée</th><td mat-cell *matCellDef="let t">{{t?.user != null ? (t?.user?.firstName + ' ' + t?.user?.lastName) : '—'}}</td></ng-container>

      <ng-container matColumnDef="status">
        <th mat-header-cell *matHeaderCellDef>Statut</th>
        <td mat-cell *matCellDef="let t">{{ statusLabel(t.status) }}</td>
      </ng-container>

      <ng-container matColumnDef="createdAtUtc"><th mat-header-cell *matHeaderCellDef>Date de Creation</th><td mat-cell *matCellDef="let t">{{ t.createdAtUtc | date:'dd/MM/yyyy HH:mm:ss' }}</td></ng-container>

      <ng-container matColumnDef="actions">
        <th mat-header-cell *matHeaderCellDef>Actions</th>
        <td mat-cell *matCellDef="let t" class="actions">
          <button mat-stroked-button color="primary" (click)="requestUpdateStatus.emit(t)">Modifier statut</button>
          <button mat-stroked-button color="warn" (click)="requestDelete.emit(t)">Supprimer</button>
        </td>
      </ng-container>

      <tr mat-header-row *matHeaderRowDef="displayed"></tr>
      <tr mat-row *matRowDef="let row; columns: displayed;"></tr>
    </table>

      <div class="no-data"  *ngIf="tasks.length === 0">
        <mat-icon>info</mat-icon>
        Aucune donnée trouvée
      </div>
  `,
  styles: [`
    .full{width:100%;overflow:auto} 
    .actions{display:flex;gap:8px;padding: 1em 0 1em 0;}
    .no-data { text-align: center; color: #777; font-size: 16px; margin: 24px 0; display: flex; align-items: center; justify-content: center; gap: 8px;}
  `]
})
export class TaskListComponent {
  @Input() tasks: Task[] = [];
  @Output() requestUpdateStatus = new EventEmitter<Task>();
  @Output() requestDelete = new EventEmitter<Task>();

  displayed = ['title', 'assignedTo', 'status', 'createdAtUtc', 'actions'];

  statusLabel(s: number) {
    switch (s) {
      case TaskState.Todo: return 'À faire';
      case TaskState.InProgress: return 'En cours';
      case TaskState.Done: return 'Complété';
      default: return '—';
    }
  }
}
