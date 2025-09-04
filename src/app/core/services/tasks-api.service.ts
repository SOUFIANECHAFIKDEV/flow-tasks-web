import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Task } from '../../shared/models/task';
import { CreateTaskRequest } from '../../shared/models/create-task-request';
import { UpdateStatusRequest } from '../../shared/models/update-status-request';
import { environment } from '../../../environment/environment';
import { PagedResult } from '../../shared/models/paged-result';

@Injectable({ providedIn: 'root' })
export class TasksApiService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  getAll(
    page = 1,
    pageSize = 10,
    sortBy?: string,
    sortDir?: 'asc' | 'desc',
    q?: string,
    status?: number,
    assignedTo?: string,
  ) {
    let params = new HttpParams()
      .set('page', page)
      .set('pageSize', pageSize);
    if (sortBy) params = params.set('sortBy', sortBy);
    if (sortDir) params = params.set('desc', sortDir == 'desc');
    if (q) params = params.set('search', q);
    if (status !== undefined) params = params.set('status', status);
    if (assignedTo) params = params.set('assignedTo', assignedTo);
    return this.http.get<PagedResult<Task>>(`${this.base}/tasks`, { params });
  }

  create(payload: CreateTaskRequest) { return this.http.post<Task>(`${this.base}/tasks`, payload); }
  updateStatus(id: number, payload: UpdateStatusRequest) { return this.http.patch<Task>(`${this.base}/tasks/${id}`, payload); }
  softDelete(id: number) { return this.http.delete<void>(`${this.base}/tasks/${id}`); }
}