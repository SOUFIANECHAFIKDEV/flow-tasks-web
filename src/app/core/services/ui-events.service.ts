import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UiEventsService {
    private addTaskRequestedSource = new Subject<void>();
    addTaskRequested$ = this.addTaskRequestedSource.asObservable();

    requestAddTask() { this.addTaskRequestedSource.next(); }
}