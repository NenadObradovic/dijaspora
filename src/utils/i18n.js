import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import sr from '../locales/sr/translation.json';
import en from '../locales/en/translation.json';

i18n.use(initReactI18next).init({
	resources: {
		sr: { translation: sr },
		en: { translation: en },
	},
	lng: 'sr',
	fallbackLng: 'sr',
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
