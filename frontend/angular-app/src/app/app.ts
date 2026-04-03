import { Component } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  template: `
    <div class="app-layout">
      <header class="header">
        <div class="header-container">
          <div class="brand">
            <span class="logo">OMS</span>
            <span class="app-name">Portal</span>
          </div>
          <nav *ngIf="authService.currentUser$ | async as user" class="nav">
            <a routerLink="/dashboard" routerLinkActive="active">Dashboard</a>
            <a routerLink="/products" routerLinkActive="active">Products</a>
            <a routerLink="/orders" routerLinkActive="active">Orders</a>
          </nav>
          <div class="user-menu" *ngIf="authService.currentUser$ | async as user">
            <span class="user-info">
              <span class="username">{{user.username || 'User'}}</span>
              <span class="role-badge">{{user.role}}</span>
            </span>
            <button (click)="authService.logout()" class="btn btn-logout">Logout</button>
          </div>
        </div>
      </header>
      <main class="main-content">
        <div class="container">
          <router-outlet></router-outlet>
        </div>
      </main>
    </div>
  `,
  styles: [`
    .app-layout { min-height: 100vh; display: flex; flex-direction: column; }
    .header { background: #1e293b; color: white; border-bottom: 1px solid #334155; position: sticky; top: 0; z-index: 100; }
    .header-container { max-width: 1200px; margin: 0 auto; display: flex; align-items: center; padding: 0.75rem 1.5rem; height: 64px; }
    .brand { display: flex; align-items: center; gap: 4px; margin-right: 2rem; }
    .logo { background: #3b82f6; padding: 4px 8px; border-radius: 6px; font-weight: 800; letter-spacing: -0.025em; }
    .app-name { font-weight: 600; color: #f1f5f9; }
    .nav { display: flex; gap: 1rem; flex: 1; }
    .nav a { color: #94a3b8; text-decoration: none; font-size: 0.875rem; font-weight: 500; padding: 0.5rem 0.75rem; border-radius: 6px; transition: all 0.2s; }
    .nav a:hover { color: white; background: #334155; }
    .nav a.active { color: white; background: #334155; }
    .user-menu { display: flex; align-items: center; gap: 1rem; }
    .user-info { display: flex; flex-direction: column; align-items: flex-end; }
    .username { font-size: 0.875rem; font-weight: 500; }
    .role-badge { font-size: 0.75rem; color: #3b82f6; font-weight: 600; text-transform: uppercase; }
    .btn-logout { background: transparent; border: 1px solid #334155; color: #f1f5f9; padding: 4px 12px; font-size: 0.75rem; }
    .btn-logout:hover { background: #ef4444; border-color: #ef4444; }
    .main-content { flex: 1; padding: 2rem 1.5rem; }
    .container { max-width: 1200px; margin: 0 auto; }
  `]
})
export class App {
  constructor(public authService: AuthService) {}
}
