import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import srLatn from '../locales/sr/translation.json';
import srCyrl from '../locales/sr-cyrl/translation.json';
import en from '../locales/en/translation.json';

i18n.use(initReactI18next).init({
	resources: {
		'sr-Latn': { translation: srLatn },
		'sr-Cyrl': { translation: srCyrl },
		en: { translation: en },
	},
	lng: 'sr-Latn',
	fallbackLng: 'sr-Latn',
	interpolation: {
		escapeValue: false,
	},
});

export default i18n;
