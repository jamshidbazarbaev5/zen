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

export interface OrderModifier {
  modifier_id: number;
  quantity: number;
}

export interface CreateOrderItem {
  product_id: number;
  quantity: number;
  modifiers: OrderModifier[];
}

export interface CreateOrderRequest {
  pickup_time: string;
  total_amount: string;
  use_balance: boolean;
  order_type: "delivery" | "pickup";
  items: CreateOrderItem[];
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
