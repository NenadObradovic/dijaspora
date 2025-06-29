import { config as defaultConfig } from '@epic-web/config/prettier'

/** @type {import("prettier").Options} */
export default {
  ...defaultConfig,
  useTabs: false,
  plugins: ['prettier-plugin-astro'],
}
