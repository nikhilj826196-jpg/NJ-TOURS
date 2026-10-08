import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from '../locales/en/translation.json';
import mrTranslation from '../locales/mr/translation.json';
import hiTranslation from '../locales/hi/translation.json';

const SAVED_LANGUAGE_KEY = 'nj_tours_language';
const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem(SAVED_LANGUAGE_KEY) : null;

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      mr: { translation: mrTranslation },
      hi: { translation: hiTranslation },
    },
    lng: savedLanguage || 'en',
    fallbackLng: 'en',
    defaultNS: 'translation',
    ns: ['translation'],
    interpolation: {
      escapeValue: false,
    },
  });

i18n.on('languageChanged', (lng) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SAVED_LANGUAGE_KEY, lng);
  }
});

export default i18n;
