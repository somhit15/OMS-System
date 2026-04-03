import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Product, ProductCreate, ProductUpdate } from '../../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProducts(search?: string): Observable<Product[]> {
    const params: any = {};
    if (search) params.search = search;
    return this.http.get<Product[]>(`${environment.apiUrl}/products`, { params });
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${environment.apiUrl}/products/${id}`);
  }

  createProduct(product: ProductCreate): Observable<Product> {
    return this.http.post<Product>(`${environment.apiUrl}/products`, product);
  }

  updateProduct(id: number, product: ProductUpdate): Observable<Product> {
    return this.http.put<Product>(`${environment.apiUrl}/products/${id}`, product);
  }

  deactivateProduct(id: number): Observable<Product> {
    return this.http.patch<Product>(`${environment.apiUrl}/products/${id}/deactivate`, {});
  }
}
