import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatIconModule, MatButtonModule, MatSnackBarModule],
  template: `
    <mat-toolbar color="primary" class="toolbar">
      <a routerLink="/tasks" class="brand">
      <img  src="//images.squarespace-cdn.com/content/v1/6413214008c9a06f379a8bcc/7fd7ce5e-eba4-4e8d-b323-4a35033f38c8/flowPink2.png?format=1500w" 
            alt="Flow: Concentrez-vous sur l&amp;#39;humain" 
            fetchpriority="high" 
            loading="eager" 
            decoding="async" 
            data-loader="raw">
      </a>
    </mat-toolbar>

    <router-outlet></router-outlet>
  `,
  styles: [`
    .toolbar{position:sticky;top:0;z-index:10}
    .spacer{flex:1}
    .brand{display:flex;align-items:center;gap:8px;color:inherit;text-decoration:none}
    .brand img{border-radius:6px;display:block; width: auto; max-width: 75%; max-height: 50px;}
  `]
})
export class AppComponent {
}
