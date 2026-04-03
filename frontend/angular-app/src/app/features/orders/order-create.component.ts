import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { ProductService } from '../../core/services/product.service';
import { OrderService } from '../../core/services/order.service';
import { Product } from '../../shared/models/product.model';
import { OrderItemBase } from '../../shared/models/order.model';

@Component({
  selector: 'app-order-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="page-container">
      <div class="header-section">
        <div class="header-info">
          <h1>New Order</h1>
          <p>Select products and quantities to place a new order.</p>
        </div>
        <a routerLink="/orders" class="btn btn-outline">Cancel</a>
      </div>

      <div class="order-grid">
        <!-- Selection Side -->
        <div class="selection-side">
          <div class="card selection-card">
            <h3>Add Products</h3>
            <div class="form-group">
              <label>Select Product</label>
              <select [(ngModel)]="selectedProductId" class="product-select">
                <option [value]="undefined" disabled selected>Choose an item...</option>
                <option *ngFor="let p of activeProducts" [value]="p.id">
                  {{p.name}} ({{p.price | currency}}) - {{p.stock_quantity}} in stock
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>Quantity</label>
              <input type="number" [(ngModel)]="selectedQuantity" min="1" class="qty-input">
            </div>
            <button (click)="addToCart()" class="btn btn-primary add-btn" [disabled]="!selectedProductId">
              Add to Cart
            </button>
          </div>

          <div class="card info-card">
            <h4>Quick Help</h4>
            <ul>
              <li>Stock is validated upon placement.</li>
              <li>Inactive products are hidden.</li>
              <li>Maximum 50 items per order line.</li>
            </ul>
          </div>
        </div>

        <!-- Cart Side -->
        <div class="cart-side">
          <div class="card cart-card">
            <div class="cart-header">
              <h3>Cart Summary</h3>
              <span class="item-count">{{cart.length}} items</span>
            </div>
            
            <div class="cart-items">
              <div *ngFor="let item of cart; let i = index" class="cart-item">
                <div class="item-info">
                  <span class="item-name">{{item.name}}</span>
                  <span class="item-details">{{item.quantity}} x {{item.price | currency}}</span>
                </div>
                <div class="item-actions">
                  <span class="item-total">{{item.price * item.quantity | currency}}</span>
                  <button (click)="removeFromCart(i)" class="btn-remove" title="Remove">×</button>
                </div>
              </div>
              <div *ngIf="cart.length === 0" class="empty-cart">
                Your cart is empty. Add products to get started.
              </div>
            </div>

            <div class="cart-footer">
              <div class="total-row">
                <span>Estimated Total</span>
                <span class="total-amount">{{cartTotal | currency}}</span>
              </div>
              <button (click)="placeOrder()" 
                      [disabled]="cart.length === 0 || loading" 
                      class="btn btn-primary place-order-btn">
                {{loading ? 'Processing...' : 'Confirm Order'}}
              </button>
              <div *ngIf="error" class="error-msg">{{error}}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .page-container { max-width: 1100px; margin: 0 auto; }
    .header-section { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 2rem; }
    .header-info p { color: #64748b; margin-top: -0.5rem; }

    .order-grid { display: grid; grid-template-columns: 1fr 400px; gap: 2rem; align-items: start; }
    
    .selection-card { margin-bottom: 1.5rem; }
    .selection-card h3 { font-size: 1.125rem; margin-bottom: 1.25rem; }
    .add-btn { width: 100%; margin-top: 0.5rem; }
    
    .info-card h4 { font-size: 0.875rem; color: #1e293b; margin-bottom: 0.75rem; }
    .info-card ul { padding-left: 1.25rem; font-size: 0.8125rem; color: #64748b; line-height: 1.6; }

    .cart-card { padding: 0; display: flex; flex-direction: column; position: sticky; top: 100px; }
    .cart-header { padding: 1.25rem; border-bottom: 1px solid var(--border-color); display: flex; justify-content: space-between; align-items: center; }
    .cart-header h3 { margin: 0; font-size: 1.125rem; }
    .item-count { font-size: 0.75rem; font-weight: 600; color: #3b82f6; background: #eff6ff; padding: 2px 8px; border-radius: 999px; }
    
    .cart-items { min-height: 200px; max-height: 400px; overflow-y: auto; padding: 0.5rem 0; }
    .cart-item { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 1.25rem; border-bottom: 1px solid #f8fafc; }
    .item-info { display: flex; flex-direction: column; }
    .item-name { font-weight: 500; font-size: 0.875rem; }
    .item-details { font-size: 0.75rem; color: #94a3b8; }
    .item-actions { display: flex; align-items: center; gap: 12px; }
    .item-total { font-weight: 600; font-size: 0.875rem; color: #1e293b; }
    .btn-remove { background: none; border: none; color: #cbd5e1; font-size: 1.25rem; cursor: pointer; padding: 0 4px; line-height: 1; }
    .btn-remove:hover { color: #ef4444; }
    
    .empty-cart { padding: 3rem 1.5rem; text-align: center; color: #94a3b8; font-size: 0.875rem; font-style: italic; }
    
    .cart-footer { padding: 1.25rem; background: #f8fafc; border-top: 1px solid var(--border-color); }
    .total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.25rem; font-weight: 700; color: #1e293b; }
    .total-amount { font-size: 1.25rem; color: #2563eb; }
    .place-order-btn { width: 100%; height: 44px; font-size: 1rem; }
    .error-msg { margin-top: 1rem; color: #ef4444; font-size: 0.8125rem; text-align: center; }
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
      // Reset selection
      this.selectedProductId = undefined;
      this.selectedQuantity = 1;
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
