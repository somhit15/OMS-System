import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { OrderResponse, OrderCreate, OrderStatusUpdate } from '../../shared/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) {}

  getOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${environment.apiUrl}/orders`);
  }

  getOrder(id: number): Observable<OrderResponse> {
    return this.http.get<OrderResponse>(`${environment.apiUrl}/orders/${id}`);
  }

  createOrder(order: OrderCreate): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${environment.apiUrl}/orders`, order);
  }

  updateOrderStatus(id: number, statusUpdate: OrderStatusUpdate): Observable<OrderResponse> {
    return this.http.patch<OrderResponse>(`${environment.apiUrl}/orders/${id}/status`, statusUpdate);
  }
}
