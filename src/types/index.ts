export interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
  image: string;
  description: string;
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

export type Screen = "home" | "cart";
export type DeliveryMode = "delivery" | "pickup";
