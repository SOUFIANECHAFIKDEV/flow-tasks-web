import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { TaskState } from '../../shared/models/task-state';

type Data = { current: TaskState };

@Component({
    selector: 'app-update-status-dialog',
    standalone: true,
    imports: [CommonModule, MatDialogModule, MatButtonModule, MatSelectModule],
    template: `
    <h2 mat-dialog-title>Modifier le statut</h2>
    <div mat-dialog-content>
      <mat-select [(value)]="value">
        <mat-option [value]="TaskState.Todo">À faire</mat-option>
        <mat-option [value]="TaskState.InProgress">En cours</mat-option>
        <mat-option [value]="TaskState.Done">Complété</mat-option>
      </mat-select>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-stroked-button (click)="close()">Annuler</button>
      <button mat-raised-button color="primary" (click)="save()">Modifier</button>
    </div>
  `
})
export class UpdateStatusDialogComponent {
    private ref = inject(MatDialogRef<UpdateStatusDialogComponent>);
    data = inject<Data>(MAT_DIALOG_DATA);
    TaskState = TaskState;
    value: TaskState = this.data.current;

    close() { this.ref.close(); }
    save() { this.ref.close(this.value); }
}
