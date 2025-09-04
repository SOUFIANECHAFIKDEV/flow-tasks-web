import { Component, EventEmitter, OnInit, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { TaskState } from '../../shared/models/task-state';
import { User } from '../../shared/models/User';
import { UsersApiService } from '../../core/services/Users-api.service';


@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule],
  template: `
<form [formGroup]="form" (ngSubmit)="submit()" class="form">
  <!-- Titre -->
  <mat-form-field appearance="outline">
    <mat-label>Titre</mat-label>
    <input matInput formControlName="title" maxlength="120" required>
    <mat-hint align="end">{{ form.get('title')?.value?.length || 0 }} / 120</mat-hint>

    <mat-error *ngIf="fc.title.touched && fc.title.hasError('required')">
      Le titre est obligatoire.
    </mat-error>
    <mat-error *ngIf="fc.title.touched && fc.title.hasError('maxlength')">
      Maximum 120 caractères.
    </mat-error>
  </mat-form-field>

  <!-- Description -->
  <mat-form-field appearance="outline">
    <mat-label>Description</mat-label>
    <textarea matInput rows="3" formControlName="description" maxlength="255" required></textarea>
    <mat-hint align="end">{{ form.get('description')?.value?.length || 0 }} / 255</mat-hint>

    <mat-error *ngIf="fc.description.touched && fc.description.hasError('required')">
      La description est obligatoire.
    </mat-error>
    <mat-error *ngIf="fc.description.touched && fc.description.hasError('maxlength')">
      Maximum 255 caractères.
    </mat-error>
  </mat-form-field>

  <!-- Assigné à -->
  <mat-form-field appearance="outline">
    <mat-label>Assigné à</mat-label>
    <mat-select formControlName="assignedUserId" required>
      <mat-option [value]="null">-- Aucun --</mat-option>
      <mat-option *ngFor="let user of users" [value]="user.id">
        {{ user.firstName }} {{ user.lastName }} ({{ user.email }})
      </mat-option>
    </mat-select>

    <mat-error *ngIf="fc.assignedUserId.touched && fc.assignedUserId.hasError('required')">
      Veuillez sélectionner un utilisateur (ou choisir “Aucun”).
    </mat-error>
  </mat-form-field>

  <!-- Statut -->
  <mat-form-field appearance="outline">
    <mat-label>Statut initial</mat-label>
    <mat-select formControlName="status" required>
      <mat-option [value]="null">Par défaut (À faire)</mat-option>
      <mat-option [value]="TaskState.Todo">À faire</mat-option>
      <mat-option [value]="TaskState.InProgress">En cours</mat-option>
      <mat-option [value]="TaskState.Done">Complété</mat-option>
    </mat-select>

    <mat-error *ngIf="fc.status.touched && fc.status.hasError('required')">
      Le statut est obligatoire.
    </mat-error>
  </mat-form-field>

  <button mat-raised-button color="primary" type="submit">
    Ajouter
  </button>
</form>

  `,
  styles: [`.form{display:grid;grid-template-columns:1fr;gap:12px;padding: 1rem 0 0rem 0}`]
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