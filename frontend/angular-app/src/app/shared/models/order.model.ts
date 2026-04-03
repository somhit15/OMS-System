export enum OrderStatus {
  CREATED = 'Created',
  PROCESSING = 'Processing',
  COMPLETED = 'Completed',
}

export interface OrderItemBase {
  product_id: number;
  quantity: number;
}

export interface OrderItemResponse extends OrderItemBase {
  id: number;
  unit_price: number;
  line_total: number;
}

export interface OrderCreate {
  items: OrderItemBase[];
}

export interface OrderStatusUpdate {
  status: OrderStatus;
}

export interface OrderResponse {
  id: number;
  order_no: string;
  user_id: number;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  items: OrderItemResponse[];
}
