import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TaskState } from '../../../../shared/models/task-state';
import { User } from '../../../../shared/models/User';
import { UsersApiService } from '../../../../core/services/Users-api.service';


@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss']
})
export class TaskFormComponent implements OnInit {
  @Output() submitTask = new EventEmitter<{
    title: string;
    description?: string | null;
    assignedUserId?: number | null;
    status?: number | null;
  }>();

  private api = inject(UsersApiService);
  private fb = inject(FormBuilder);

  loading = signal<boolean>(false);
  TaskState = TaskState;

  form = this.fb.group({
    title: ['', [Validators.required, Validators.maxLength(120)]],
    description: ['', [Validators.required, Validators.maxLength(255)]],
    assignedUserId: [null as number | null, [Validators.required]],
    status: [null as number | null, [Validators.required]]
  });

  // Raccourcis propres pour le template
  get fc() {
    return {
      title: this.form.get('title')!,
      description: this.form.get('description')!,
      assignedUserId: this.form.get('assignedUserId')!,
      status: this.form.get('status')!
    };
  }

  users: User[] = [];

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched(); // affiche toutes les erreurs
      return;
    }
    this.submitTask.emit(this.form.value as any);
    this.form.reset();
  }

  ngOnInit(): void {
    this.loading.set(true);
    this.api.getAll().subscribe({
      next: users => { this.users = users; this.loading.set(false); },
      error: _ => { this.loading.set(false); }
    });
  }
}