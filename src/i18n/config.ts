import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ru from './locales/ru.json';
import uz from './locales/uz.json';
import kk from './locales/kk.json';

const resources = {
  en: { translation: en },
  ru: { translation: ru },
  uz: { translation: uz },
  kk: { translation: kk },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'ru', // default language
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
