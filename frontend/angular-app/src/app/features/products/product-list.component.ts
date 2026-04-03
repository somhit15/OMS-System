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
    <div class="container">
      <h2>Products</h2>
      <div class="search-bar">
        <input type="text" [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="Search by name or SKU...">
        <a *ngIf="authService.isAdmin" routerLink="/products/new" class="btn btn-primary">Create Product</a>
      </div>
      
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>SKU</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let p of products">
            <td>{{p.name}}</td>
            <td>{{p.sku}}</td>
            <td>{{p.price | currency}}</td>
            <td>{{p.stock_quantity}}</td>
            <td>{{p.is_active ? 'Yes' : 'No'}}</td>
            <td>
              <a [routerLink]="['/products', p.id, 'edit']" *ngIf="authService.isAdmin" class="btn btn-sm">Edit</a>
              <button *ngIf="authService.isAdmin && p.is_active" (click)="onDeactivate(p.id)" class="btn btn-sm btn-danger">Deactivate</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  `,
  styles: [`
    .container { padding: 20px; }
    .search-bar { display: flex; justify-content: space-between; margin-bottom: 20px; }
    input { padding: 8px; width: 300px; }
    .table { width: 100%; border-collapse: collapse; }
    th, td { border: 1px solid #ddd; padding: 12px; text-align: left; }
    th { background-color: #f2f2f2; }
    .btn { padding: 8px 16px; text-decoration: none; border-radius: 4px; border: none; cursor: pointer; }
    .btn-primary { background: #007bff; color: white; }
    .btn-sm { padding: 4px 8px; font-size: 12px; margin-right: 5px; }
    .btn-danger { background: #dc3545; color: white; }
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
