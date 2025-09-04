import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { User } from '../../shared/models/User';

@Injectable({ providedIn: 'root' })
export class UsersApiService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  getAll() {
    return this.http.get<Array<User>>(`${this.base}/users`);
  }
}