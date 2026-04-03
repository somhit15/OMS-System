import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: `
    <div class="app-container">
      <header class="navbar">
        <h1>OMS Portal</h1>
        <div *ngIf="authService.currentUser$ | async as user" class="nav-links">
          <a routerLink="/dashboard">Dashboard</a>
          <a routerLink="/products">Products</a>
          <a routerLink="/orders">Orders</a>
          <button (click)="authService.logout()">Logout ({{user.role}})</button>
        </div>
      </header>
      <main class="content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-container { font-family: sans-serif; }
    .navbar { display: flex; justify-content: space-between; align-items: center; padding: 10px 20px; background: #333; color: white; }
    .nav-links { display: flex; gap: 15px; align-items: center; }
    .nav-links a { color: white; text-decoration: none; }
    .content { padding: 20px; }
    button { cursor: pointer; padding: 5px 10px; }
  `]
})
export class App {
  constructor(public authService: AuthService) {}
}
