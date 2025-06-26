import srLatn from '../locales/sr/translation.json'
import srCyrl from '../locales/sr-cyrl/translation.json'
import en from '../locales/en/translation.json'

const translationsMap = {
  sr: srLatn,
  'sr-cyrl': srCyrl,
  en: en,
}

/**
 * Returns the translation object for the requested section (e.g. 'header_nav') in the specified language.
 *
 * @param {string} lang - 'sr', 'sr-cyrl', 'en'
 * @param {string} section - npr. 'header_nav'
 * @returns {object}
 */
export function tObject(lang, section) {
  return translationsMap[lang]?.[section] ?? {}
}

/**
 * Returns the translation string for the requested section (e.g. 'footer_text') in the specified language.
 *
 * @param {string} lang - 'sr', 'sr-cyrl', 'en'
 * @param {string} section - npr. 'footer_text'
 * @returns {string}
 */
export function tString(lang, section) {
  return translationsMap[lang]?.[section] ?? ''
}
