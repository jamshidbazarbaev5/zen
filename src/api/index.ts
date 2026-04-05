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

export default api;
