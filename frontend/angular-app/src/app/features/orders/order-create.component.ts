import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { OrderService } from '../../core/services/order.service';
import { Product } from '../../shared/models/product.model';
import { OrderItemBase } from '../../shared/models/order.model';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container">
      <h2>Place New Order</h2>
      <div class="product-selector">
        <div class="form-group">
          <label>Select Product</label>
          <select [(ngModel)]="selectedProductId">
            <option *ngFor="let p of activeProducts" [value]="p.id">{{p.name}} (Stock: {{p.stock_quantity}}) - {{p.price | currency}}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Quantity</label>
          <input type="number" [(ngModel)]="selectedQuantity" min="1">
        </div>
        <button (click)="addToCart()" class="btn">Add to Cart</button>
      </div>

      <h3>Cart</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Product</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of cart; let i = index">
            <td>{{item.name}}</td>
            <td>{{item.quantity}}</td>
            <td>{{item.price | currency}}</td>
            <td>{{item.price * item.quantity | currency}}</td>
            <td><button (click)="removeFromCart(i)" class="btn btn-sm btn-danger">Remove</button></td>
          </tr>
        </tbody>
        <tfoot>
          <tr>
            <td colspan="3"><strong>Total Amount (est)</strong></td>
            <td colspan="2"><strong>{{cartTotal | currency}}</strong></td>
          </tr>
        </tfoot>
      </table>

      <div class="order-actions">
        <button (click)="placeOrder()" [disabled]="cart.length === 0 || loading" class="btn btn-primary">Place Order</button>
        <div *ngIf="error" class="error">{{error}}</div>
      </div>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .product-selector { display: flex; gap: 20px; align-items: flex-end; margin-bottom: 30px; border: 1px solid #ddd; padding: 20px; border-radius: 8px; }
    .form-group { flex: 1; }
    label { display: block; margin-bottom: 5px; }
    select, input { width: 100%; padding: 8px; box-sizing: border-box; }
    .table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    .btn { padding: 10px 20px; background: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; }
    .btn-danger { background: #dc3545; }
    .btn-primary { background: #007bff; }
    .btn-sm { padding: 4px 8px; }
    .error { color: red; margin-top: 10px; }
    .order-actions { margin-top: 20px; }
  `]
})
export class OrderCreateComponent implements OnInit {
  activeProducts: Product[] = [];
  selectedProductId?: number;
  selectedQuantity = 1;
  cart: any[] = [];
  loading = false;
  error = '';

  constructor(
    private productService: ProductService,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit() {
    this.productService.getProducts().subscribe(data => {
      this.activeProducts = data.filter(p => p.is_active && p.stock_quantity > 0);
    });
  }

  addToCart() {
    if (!this.selectedProductId) return;
    const product = this.activeProducts.find(p => p.id === Number(this.selectedProductId));
    if (product) {
      if (this.selectedQuantity > product.stock_quantity) {
        alert(`Only ${product.stock_quantity} available`);
        return;
      }
      this.cart.push({
        product_id: product.id,
        name: product.name,
        quantity: this.selectedQuantity,
        price: product.price
      });
    }
  }

  removeFromCart(index: number) {
    this.cart.splice(index, 1);
  }

  get cartTotal() {
    return this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  placeOrder() {
    this.loading = true;
    this.error = '';
    const orderItems: OrderItemBase[] = this.cart.map(item => ({
      product_id: item.product_id,
      quantity: item.quantity
    }));

    this.orderService.createOrder({ items: orderItems }).subscribe({
      next: () => {
        alert('Order placed successfully!');
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        this.error = err.error?.detail || 'Failed to place order';
        this.loading = false;
      }
    });
  }
}
