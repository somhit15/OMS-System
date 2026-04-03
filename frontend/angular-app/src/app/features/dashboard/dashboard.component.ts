import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-wrapper">
      <div class="welcome-header">
        <h1>Overview</h1>
        <p>Manage your products and orders from the central dashboard.</p>
      </div>

      <div class="stat-cards">
        <div class="card stat-card">
          <div class="icon-box blue">P</div>
          <div class="stat-info">
            <span class="stat-label">Product Catalog</span>
            <a routerLink="/products" class="stat-link">View all products →</a>
          </div>
        </div>
        <div class="card stat-card">
          <div class="icon-box amber">O</div>
          <div class="stat-info">
            <span class="stat-label">Recent Orders</span>
            <a routerLink="/orders" class="stat-link">View order history →</a>
          </div>
        </div>
      </div>

      <h2 class="section-title">Quick Actions</h2>
      <div class="actions-grid">
        <div class="card action-card">
          <h3>Create Order</h3>
          <p>Place a new customer order with multiple products.</p>
          <a routerLink="/orders/new" class="btn btn-primary">New Order</a>
        </div>
        
        <div class="card action-card" *ngIf="authService.isAdmin">
          <h3>Inventory</h3>
          <p>Add new products to the catalog or update stock.</p>
          <a routerLink="/products/new" class="btn btn-outline">Add Product</a>
        </div>

        <div class="card action-card">
          <h3>User Profile</h3>
          <p>Manage your account settings and preferences.</p>
          <button class="btn btn-outline" disabled>Settings</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-wrapper { max-width: 1000px; margin: 0 auto; }
    .welcome-header { margin-bottom: 2.5rem; }
    .welcome-header p { color: #64748b; margin-top: -0.5rem; }
    
    .stat-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 1.5rem; margin-bottom: 3rem; }
    .stat-card { display: flex; align-items: center; gap: 1.25rem; }
    .icon-box { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-weight: 700; color: white; }
    .blue { background: #3b82f6; }
    .amber { background: #f59e0b; }
    .stat-info { display: flex; flex-direction: column; }
    .stat-label { font-size: 0.875rem; color: #64748b; font-weight: 500; }
    .stat-link { color: #3b82f6; text-decoration: none; font-size: 0.875rem; font-weight: 600; margin-top: 2px; }
    
    .section-title { margin-bottom: 1.5rem; font-size: 1.25rem; }
    .actions-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; }
    .action-card h3 { font-size: 1.125rem; margin-bottom: 0.5rem; }
    .action-card p { font-size: 0.875rem; color: #64748b; margin-bottom: 1.5rem; min-height: 40px; }
    .action-card .btn { width: 100%; }
  `]
})
export class DashboardComponent {
  constructor(public authService: AuthService) {}
}
