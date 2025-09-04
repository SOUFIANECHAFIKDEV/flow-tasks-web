import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { Task } from '../../../../shared/models/task';
import { TaskState } from '../../../../shared/models/task-state';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule, MatIconModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
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

  statusClass(s: number): string {
    switch (s) {
      case TaskState.Todo: return 'todo';
      case TaskState.InProgress: return 'in-progress';
      case TaskState.Done: return 'done';
      default: return 'unknown';
    }
  }
}
