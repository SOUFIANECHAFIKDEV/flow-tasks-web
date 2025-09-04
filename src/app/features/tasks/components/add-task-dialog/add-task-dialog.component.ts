import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TaskFormComponent } from '../task-form/task-form.component';

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, TaskFormComponent],
  templateUrl: './add-task-dialog.component.html',
  styleUrls: ['./add-task-dialog.component.scss']
})
export class AddTaskDialogComponent {
  private ref = inject(MatDialogRef<AddTaskDialogComponent>);
  onSubmit(payload: any) {
    this.ref.close(payload);
  }
  close() { this.ref.close(); }
}