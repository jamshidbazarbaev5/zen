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

export const authenticateTelegram = async (initData: string): Promise<string> => {
  const { data } = await api.post<{ token: string }>("/auth/telegram/", {
    init_data: initData,
  });
  const token = data.token;
  console.log("Telegram auth token:", token);
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

  const profile = await api.get("/customers/me/");
  console.log("Profile data:", profile.data);

  return token;
};

export default api;
