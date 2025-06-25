import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import srLatn from '../locales/sr/translation.json'
import srCyrl from '../locales/sr-cyrl/translation.json'
import en from '../locales/en/translation.json'

i18n.use(initReactI18next).init({
  resources: {
    sr: { translation: srLatn },
    'sr-cyrl': { translation: srCyrl },
    en: { translation: en },
  },
  lng: 'sr',
  fallbackLng: 'sr',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
