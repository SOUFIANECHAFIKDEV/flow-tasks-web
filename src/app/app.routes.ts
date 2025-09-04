import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'tasks' },
  { path: 'tasks', loadComponent: () => import('./features/tasks/tasks.page').then(m => m.TasksPageComponent) },
  { path: '**', redirectTo: 'tasks' }
];
