import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-container">
      <nav>
        <span>Welcome, {{authService.currentUserValue?.username || 'User'}}</span>
        <button (click)="authService.logout()">Logout</button>
      </nav>
      <h1>OMS Dashboard</h1>
      <div class="actions">
        <a routerLink="/products" class="btn">View Products</a>
        <a routerLink="/orders" class="btn">View Orders</a>
        <a *ngIf="authService.isAdmin" routerLink="/products/new" class="btn">Create Product</a>
        <a routerLink="/orders/new" class="btn">Place New Order</a>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container { padding: 20px; }
    nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
    .actions { display: flex; gap: 15px; }
    .btn { display: inline-block; padding: 10px 20px; background: #007bff; color: white; border-radius: 4px; text-decoration: none; cursor: pointer; border: none; }
    .btn:hover { background: #0056b3; }
  `]
})
export class DashboardComponent {
  constructor(public authService: AuthService) {}
}
