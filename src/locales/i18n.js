import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './en.json';
import ru from './ru.json';
import zh from './zh.json';
import be from './be.json';
import uk from './uk.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en,
      },
      ru: {
        translation: ru,
      },
      zh: {
        translation: zh,
      },
      be: {
        translation: be,
      },
      uk: {
        translation: uk,
      },
    },
    lng: 'en', // язык по умолчанию
    fallbackLng: 'en', // язык, который будет использован в случае отсутствия перевода
    interpolation: {
      escapeValue: false, // если true, экранирование данных будет применено
    },
  });