import { TaskState } from './task-state';
export interface CreateTaskRequest {
  title: string; description?: string|null; assignedTo?: string|null; status?: TaskState|null;
}
