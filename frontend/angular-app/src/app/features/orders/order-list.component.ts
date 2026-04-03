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
    <div class="container">
      <h2>Orders</h2>
      <table class="table">
        <thead>
          <tr>
            <th>Order No</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let o of orders">
            <td>{{o.order_no}}</td>
            <td>{{o.created_at | date:'short'}}</td>
            <td>
              <span class="status-badge" [ngClass]="o.status.toLowerCase()">{{o.status}}</span>
            </td>
            <td>{{o.total_amount | currency}}</td>
            <td>
              <button *ngIf="authService.isAdmin && o.status === 'Created'" (click)="updateStatus(o.id, 'Processing')" class="btn btn-sm">Process</button>
              <button *ngIf="authService.isAdmin && o.status === 'Processing'" (click)="updateStatus(o.id, 'Completed')" class="btn btn-sm">Complete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .status-badge { padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    .created { background: #e3f2fd; color: #1976d2; }
    .processing { background: #fff3e0; color: #f57c00; }
    .completed { background: #e8f5e9; color: #388e3c; }
    .btn { padding: 4px 8px; font-size: 12px; cursor: pointer; }
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
