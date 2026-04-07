export interface Product {
  id: number;
  iiko_id: string;
  name: string;
  price: string;
  description: string;
  image_url: string;
  is_available: boolean;
  category: string;
}

export interface MenuCategory {
  id: number;
  iiko_id: string;
  name: string;
  products: Omit<Product, 'category'>[];
}

export interface Branch {
  id: number;
  name: string;
  address: string;
}

export interface Language {
  code: string;
  name: string;
  icon: string;
}

export type Screen = "home" | "cart" | "notifications";
export type DeliveryMode = "delivery" | "pickup";

export interface CreateOrderItem {
  product_iiko_id: string;
  quantity: number;
  modifiers: string[];
}

export interface CreateOrderRequest {
  delivery_type: "delivery" | "pickup";
  branch_id?: number;
  address?: string;
  lat?: number;
  lon?: number;
  scheduled_time: string;
  items: CreateOrderItem[];
  use_balance: boolean;
}

export interface CreateOrderResponse {
  order_id: number;
  order_number: string;
  payment_url: string;
}

export interface OrderItemResponse {
  product_name: string;
  quantity: number;
  price: string;
}

export interface OrderListItem {
  id: number;
  order_number: string;
  status: string;
  total: string;
  created_at: string;
  items: OrderItemResponse[];
}
