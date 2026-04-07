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

export type Screen = "home" | "cart" | "notifications" | "profile";

export interface CustomerProfile {
  id: number;
  telegram_id: number;
  name: string;
  phone: string;
  lang: string;
  balance: string;
  total_spent: string;
  is_active: boolean;
}
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
  delivery_address?: string;
  delivery_flat?: string;
  delivery_entrance?: string;
  delivery_floor?: string;
  delivery_comment?: string;
  delivery_latitude?: number;
  delivery_longitude?: number;
}

export interface CreateOrderResponse {
  order_id: number;
  order_number: string;
  payment_url: string;
}

export interface OrderItemResponse {
  id: number;
  product_name: string;
  quantity: number;
  price: string;
  subtotal: number;
  modifiers: unknown[];
}

export interface OrderListItem {
  id: number;
  number: string;
  status: string;
  order_type: "pickup" | "delivery";
  pickup_location: string | null;
  pickup_location_name: string | null;
  delivery_address: string;
  delivery_flat: string;
  delivery_entrance: string;
  delivery_floor: string;
  delivery_comment: string;
  delivery_latitude: number | null;
  delivery_longitude: number | null;
  total_amount: string;
  balance_used: string;
  online_paid: string;
  pickup_time: string;
  items: OrderItemResponse[];
  payment_url: string;
  created_at: string;
}
