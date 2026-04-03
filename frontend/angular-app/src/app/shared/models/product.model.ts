export interface Product {
  id: number;
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
  is_active: boolean;
}

export interface ProductCreate {
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
  is_active?: boolean;
}

export interface ProductUpdate {
  name?: string;
  sku?: string;
  price?: number;
  stock_quantity?: number;
  is_active?: boolean;
}
