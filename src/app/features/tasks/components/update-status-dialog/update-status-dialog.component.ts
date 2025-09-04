import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { TaskState } from '../../../../shared/models/task-state';

type Data = { current: TaskState };

@Component({
  selector: 'app-update-status-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatSelectModule],
  templateUrl: './update-status-dialog.component.html',
  styleUrls: ['./update-status-dialog.component.scss']
})
export class UpdateStatusDialogComponent {
  private ref = inject(MatDialogRef<UpdateStatusDialogComponent>);
  data = inject<Data>(MAT_DIALOG_DATA);
  TaskState = TaskState;
  value: TaskState = this.data.current;

  close() { this.ref.close(); }
  save() { this.ref.close(this.value); }
}
