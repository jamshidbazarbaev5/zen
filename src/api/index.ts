import axios from "axios";
import type { MenuCategory, CreateOrderRequest, CreateOrderResponse, OrderListItem, CustomerProfile, CashbackInfo, ProductDetail, BusinessInfo } from "../types";

const api = axios.create({
  baseURL: "https://zen-coffee.uz/api",
});

export const getMenu = async (lang: string): Promise<MenuCategory[]> => {
  const { data } = await api.get<MenuCategory[]>("/menu/", {
    params: { lang },
  });
  return data;
};

export const getBusinessInfo = async (): Promise<BusinessInfo> => {
  const { data } = await api.get<BusinessInfo>("/orders/business-info/");
  return data;
};

interface TelegramAuthResponse {
  access: string;
  refresh: string;
  needs_phone: boolean;
  customer: {
    id: number;
    telegram_id: number;
    name: string;
    phone: string;
    lang: string;
    balance: string;
    total_spent: string;
    is_active: boolean;
  };
}

export const authenticateTelegram = async (initData: string): Promise<TelegramAuthResponse> => {
  const { data } = await api.post<TelegramAuthResponse>("/auth/telegram/", {
    init_data: initData,
  });
  console.log("Telegram auth response:", data);
  api.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;
  return data;
};

export interface TelegramLoginData {
  id: number;
  first_name: string;
  last_name?: string;
  phone_number?: string;
  auth_date: number;
  hash: string;
}

export const authenticateTelegramLogin = async (loginData: TelegramLoginData): Promise<TelegramAuthResponse> => {
  const { data } = await api.post<TelegramAuthResponse>("/auth/telegram-login/", loginData);
  api.defaults.headers.common["Authorization"] = `Bearer ${data.access}`;
  return data;
};

export const getProductDetail = async (productId: number): Promise<ProductDetail> => {
  const { data } = await api.get<ProductDetail>(`/menu/${productId}/`);
  return data;
};

export const createOrder = async (payload: CreateOrderRequest): Promise<CreateOrderResponse> => {
  const { data } = await api.post<CreateOrderResponse>("/orders/create/", payload);
  return data;
};

export const getMyOrders = async (): Promise<OrderListItem[]> => {
  const { data } = await api.get<OrderListItem[]>("/orders/my/");
  return data;
};

export const getMyProfile = async (): Promise<CustomerProfile> => {
  const { data } = await api.get<CustomerProfile>("/customers/me/");
  return data;
};

export const updateMyProfile = async (data: { name?: string; lang?: string }): Promise<CustomerProfile> => {
  const { data: result } = await api.patch<CustomerProfile>("/customers/me/", data);
  return result;
};

export const getCashbackInfo = async (): Promise<CashbackInfo> => {
  const { data } = await api.get<CashbackInfo>("/cashback/info/");
  return data;
};

export default api;
