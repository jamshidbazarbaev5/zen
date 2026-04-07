import axios from "axios";
import type { MenuCategory } from "../types";

const api = axios.create({
  baseURL: "https://zen-coffee.uz/api",
});

export const getMenu = async (lang: string): Promise<MenuCategory[]> => {
  const { data } = await api.get<MenuCategory[]>("/menu/", {
    params: { lang },
  });
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

export default api;
