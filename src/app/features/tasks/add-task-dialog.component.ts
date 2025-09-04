import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TaskFormComponent } from './task-form.component';

@Component({
    selector: 'app-add-task-dialog',
    standalone: true,
    imports: [MatDialogModule, MatButtonModule, TaskFormComponent],
    template: `
    <h2 mat-dialog-title>Nouvelle tâche</h2>
    <div mat-dialog-content>
      <app-task-form (submitTask)="onSubmit($event)"></app-task-form>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-stroked-button (click)="close()">Annuler</button>
    </div>
  `
})
export class AddTaskDialogComponent {
    private ref = inject(MatDialogRef<AddTaskDialogComponent>);
    onSubmit(payload: any) { 
      this.ref.close(payload);
    }
    close() { this.ref.close(); }
}