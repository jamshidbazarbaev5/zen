export interface Modifier {
  id: number;
  name: string;
  price: string;
  min_amount: number;
  max_amount: number;
  default_amount: number;
}

export interface ModifierGroup {
  id: number;
  name: string;
  min_amount: number;
  max_amount: number;
  required: boolean;
  modifiers: Modifier[];
}

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

export interface ProductDetail extends Product {
  modifier_groups: ModifierGroup[];
}

export interface SelectedModifier {
  modifier_id: number;
  quantity: number;
}

export interface CartEntry {
  productId: number;
  quantity: number;
  modifiers: SelectedModifier[];
  modifierTotal: number; // extra price from modifiers per unit
}

// Cart key: "productId" or "productId_mod1-mod2" for items with modifiers
export type Cart = Record<string, CartEntry>;

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

export type Screen = "home" | "cart" | "notifications" | "profile" | "cashback" | "contact" | "about" | "balance" | "deposit";

export interface CashbackTier {
  name: string;
  percent: string;
  min_spent: string;
  max_spent?: string | null;
}

export interface CashbackNextTier extends CashbackTier {
  spend_needed: string;
  progress_percent: number;
}

export interface CashbackInfo {
  balance: string;
  deposit_balance: string;
  lifetime_spend: string;
  current_tier: CashbackTier;
  next_tier: CashbackNextTier | null;
  all_tiers: CashbackTier[];
}

export type BalanceTxType =
  | "deposit"
  | "deposit_topup"
  | "deposit_spend"
  | "cashback"
  | "cashback_spend"
  | "spend"
  | string;

export interface BalanceTransaction {
  id: number;
  amount: string;
  tx_type: BalanceTxType;
  tx_type_display?: string;
  channel?: string;
  channel_display?: string;
  balance_after?: string;
  order_number: string | null;
  iiko_order_number?: string | null;
  order_sum?: string | null;
  tier_at_time?: string;
  note: string;
  created_at: string;
}

export interface BalanceHistory {
  balance: string;
  deposit_balance: string;
  transactions: BalanceTransaction[];
}

export interface DepositResponse {
  payment_url: string;
  [key: string]: unknown;
}

export interface CustomerProfile {
  id: number;
  telegram_id: number;
  name: string;
  phone: string;
  lang: string;
  balance: string;
  deposit_balance: string;
  total_spent: string;
  is_active: boolean;
  qr_payload?: string;
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
  use_cashback: boolean;
  use_deposit: boolean;
  order_type: "delivery" | "pickup";
  items: CreateOrderItem[];
  pickup_location_id?: number;
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
  cashback_used: string;
  deposit_used: string;
  online_paid: string;
  pickup_time: string;
  items: OrderItemResponse[];
  payment_url: string;
  created_at: string;
}

export interface PickupLocation {
  id: number;
  name: string;
  address: string;
}

export interface BusinessInfo {
  open_time: string;
  close_time: string;
  delivery_enabled: boolean;
  delivery_fee: string;
  instagram_url: string;
  phone: string;
  pickup_locations: PickupLocation[];
}
