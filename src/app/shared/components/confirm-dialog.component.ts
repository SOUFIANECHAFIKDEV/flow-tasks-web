import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

type ConfirmData = { title?: string; message?: string; confirmText?: string; cancelText?: string; };

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{data.title || 'Confirmation'}}</h2>
    <div mat-dialog-content>
      <p>{{data.message || 'Êtes-vous sûr ?'}}</p>
    </div>
    <div mat-dialog-actions align="end">
      <button mat-stroked-button (click)="cancel()">{{data.cancelText || 'Annuler'}}</button>
      <button mat-raised-button color="warn" (click)="confirm()">{{data.confirmText || 'Confirmer'}}</button>
    </div>
  `
})
export class ConfirmDialogComponent {
  private ref = inject(MatDialogRef<ConfirmDialogComponent>);
  data = inject<ConfirmData>(MAT_DIALOG_DATA);

  cancel(){ this.ref.close(false); }
  confirm(){ this.ref.close(true); }
}
