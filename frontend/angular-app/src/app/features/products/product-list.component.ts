import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../core/services/product.service';
import { AuthService } from '../../core/services/auth.service';
import { Product } from '../../shared/models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  template: `
    <div class="page-container">
      <div class="header-section">
        <div class="header-info">
          <h1>Product Catalog</h1>
          <p>Browse and manage the items available for orders.</p>
        </div>
        <div class="actions" *ngIf="authService.isAdmin">
          <a routerLink="/products/new" class="btn btn-primary">+ Add Product</a>
        </div>
      </div>

      <div class="card table-card">
        <div class="table-toolbar">
          <div class="search-input">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="search-icon"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <input type="text" [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="Search by name or SKU...">
          </div>
        </div>

        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Product Info</th>
                <th>SKU</th>
                <th>Price</th>
                <th>Availability</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let p of products">
                <td>
                  <div class="product-cell">
                    <span class="product-name">{{p.name}}</span>
                    <span class="product-id">ID: #{{p.id}}</span>
                  </div>
                </td>
                <td class="sku-cell">{{p.sku}}</td>
                <td><span class="price-badge">{{p.price | currency}}</span></td>
                <td>
                  <div class="stock-info">
                    <span class="stock-count">{{p.stock_quantity}} in stock</span>
                    <span class="active-badge" [class.inactive]="!p.is_active">{{p.is_active ? 'Active' : 'Inactive'}}</span>
                  </div>
                </td>
                <td>
                  <div class="action-btns">
                    <a [routerLink]="['/products', p.id, 'edit']" *ngIf="authService.isAdmin" class="btn btn-outline btn-sm">Edit</a>
                    <button *ngIf="authService.isAdmin && p.is_active" (click)="onDeactivate(p.id)" class="btn btn-outline btn-sm btn-deactivate">Deactivate</button>
                  </div>
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
    .table-toolbar { padding: 1.25rem; border-bottom: 1px solid var(--border-color); }
    .search-input { position: relative; max-width: 360px; }
    .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #94a3b8; }
    .search-input input { padding-left: 40px; }

    .table-responsive { overflow-x: auto; }
    .product-cell { display: flex; flex-direction: column; }
    .product-name { font-weight: 600; color: #1e293b; }
    .product-id { font-size: 0.75rem; color: #94a3b8; }
    .sku-cell { font-family: monospace; font-size: 0.875rem; color: #64748b; }
    .price-badge { font-weight: 600; color: #1e293b; }
    
    .stock-info { display: flex; flex-direction: column; gap: 4px; }
    .stock-count { font-size: 0.875rem; color: #64748b; }
    .active-badge { font-size: 0.75rem; font-weight: 600; color: #16a34a; }
    .active-badge.inactive { color: #ef4444; }
    
    .action-btns { display: flex; gap: 8px; }
    .btn-sm { padding: 4px 10px; font-size: 0.75rem; }
    .btn-deactivate:hover { border-color: #ef4444; color: #ef4444; }
  `]
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  searchQuery = '';

  constructor(private productService: ProductService, public authService: AuthService) {}

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts(this.searchQuery).subscribe(data => this.products = data);
  }

  onSearch() {
    this.loadProducts();
  }

  onDeactivate(id: number) {
    if (confirm('Are you sure you want to deactivate this product?')) {
      this.productService.deactivateProduct(id).subscribe(() => this.loadProducts());
    }
  }
}
