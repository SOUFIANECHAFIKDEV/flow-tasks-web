import { TaskState } from './task-state';
import { User } from './User';
export interface Task {
  id: number; title: string;
  description?: string | null;
  status: TaskState;
  assignedUserId?: number;
  createdAtUtc: string;
  updatedAtUtc?: string | null;
  isDeleted: boolean;
  rowVersion: string;
  user?: User
}
