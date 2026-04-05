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
