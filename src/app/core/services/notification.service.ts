import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snack = inject(MatSnackBar);
  success(m: string) { this.snack.open(m, 'OK', { duration: 2000, panelClass: ['snack-success'] }); }
  info(m: string)    { this.snack.open(m, 'OK', { duration: 2000, panelClass: ['snack-info'] }); }
  error(m: string)   { this.snack.open(m, 'OK', { duration: 3000, panelClass: ['snack-error'] }); }
}
