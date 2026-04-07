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

export const authenticateTelegram = async (initData: string): Promise<void> => {
  const { data } = await api.post<{ token: string }>("/auth/telegram/", {
    init_data: initData,
  });
  api.defaults.headers.common["Authorization"] = `Bearer ${data.token}`;
};

export default api;
