import { TaskState } from './task-state';
export interface UpdateStatusRequest { status: TaskState; rowVersion: string; }
