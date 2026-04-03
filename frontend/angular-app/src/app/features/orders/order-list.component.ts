import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { OrderService } from '../../core/services/order.service';
import { AuthService } from '../../core/services/auth.service';
import { OrderResponse, OrderStatus } from '../../shared/models/order.model';

@Component({
  selector: 'app-order-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="header-section">
        <div class="header-info">
          <h1>Order History</h1>
          <p>Track and manage customer orders and their status.</p>
        </div>
        <div class="actions">
          <a routerLink="/orders/new" class="btn btn-primary">+ New Order</a>
        </div>
      </div>

      <div class="card table-card">
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Order Details</th>
                <th>Date</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let o of orders">
                <td>
                  <div class="order-cell">
                    <span class="order-no">{{o.order_no}}</span>
                    <span class="user-id">User ID: #{{o.user_id}}</span>
                  </div>
                </td>
                <td>
                  <div class="date-cell">
                    <span class="date">{{o.created_at | date:'mediumDate'}}</span>
                    <span class="time">{{o.created_at | date:'shortTime'}}</span>
                  </div>
                </td>
                <td><span class="amount">{{o.total_amount | currency}}</span></td>
                <td>
                  <span class="status-badge" [ngClass]="'status-' + o.status.toLowerCase()">
                    {{o.status}}
                  </span>
                </td>
                <td>
                  <div class="action-btns">
                    <button *ngIf="authService.isAdmin && o.status === 'Created'" (click)="updateStatus(o.id, 'Processing')" class="btn btn-outline btn-sm">Process</button>
                    <button *ngIf="authService.isAdmin && o.status === 'Processing'" (click)="updateStatus(o.id, 'Completed')" class="btn btn-outline btn-sm">Complete</button>
                    <button class="btn btn-outline btn-sm" disabled>Details</button>
                  </div>
                </td>
              </tr>
              <tr *ngIf="orders.length === 0">
                <td colspan="5" class="empty-state">
                  No orders found.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1200px; margin: 0 auto; }
    .header-section { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
    .header-info p { color: #64748b; margin-top: -0.5rem; }
    
    .table-card { padding: 0; overflow: hidden; }
    .table-responsive { overflow-x: auto; }
    
    .order-cell { display: flex; flex-direction: column; }
    .order-no { font-weight: 600; color: #1e293b; font-family: monospace; }
    .user-id { font-size: 0.75rem; color: #94a3b8; }
    
    .date-cell { display: flex; flex-direction: column; }
    .date { font-weight: 500; color: #1e293b; }
    .time { font-size: 0.75rem; color: #94a3b8; }
    
    .amount { font-weight: 600; color: #1e293b; }
    
    .action-btns { display: flex; gap: 8px; }
    .btn-sm { padding: 4px 10px; font-size: 0.75rem; }
    
    .empty-state { padding: 3rem; text-align: center; color: #94a3b8; font-style: italic; }
  `]
})
export class OrderListComponent implements OnInit {
  orders: OrderResponse[] = [];

  constructor(private orderService: OrderService, public authService: AuthService) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe(data => this.orders = data);
  }

  updateStatus(id: number, status: string) {
    this.orderService.updateOrderStatus(id, { status: status as OrderStatus }).subscribe(() => this.loadOrders());
  }
}
