import type { Branch, Language } from '../types';

export const LANGUAGES: Language[] = [
  { code: "uz", name: "O'zbekcha", icon: "\u{1F1FA}\u{1F1FF}" },
  { code: "ru", name: "\u0420\u0443\u0441\u0441\u043A\u0438\u0439", icon: "\u{1F1F7}\u{1F1FA}" },
  { code: "en", name: "English", icon: "\u{1F1EC}\u{1F1E7}" },
  { code: "kk", name: "Қазақша", icon: "\u{1F1F0}\u{1F1FF}" },
];

export const BRANCHES: Branch[] = [
  { id: 1, name: "01 Algoritm - Feed up", address: "Chilonzor tumani, Algoritm ko'chasi" },
  { id: 2, name: "02 Sergeli - Feed up", address: "Sergeli tumani, Yangi Sergeli" },
  { id: 3, name: "03 Yunusobod - Feed up", address: "Yunusobod tumani, Amir Temur shox ko'chasi" },
  { id: 4, name: "04 Mirzo Ulug'bek - Feed up", address: "Mirzo Ulug'bek tumani, Buyuk Ipak Yo'li" },
];
