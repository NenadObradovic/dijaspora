// @ts-check
import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import icon from 'astro-icon'
import tailwind from '@astrojs/tailwind'

// https://astro.build/config
export default defineConfig({
  i18n: {
    defaultLocale: 'sr-latn',
    locales: ['sr-latn', 'sr-cyrl', 'en'],
  },
  redirects: { '/en/glasanje': '/en/voting', '/en/prirucnik': '/en/handbook' },
  integrations: [
    react(),
    icon(),
    tailwind({
      applyBaseStyles: false,
      nesting: true,
    }),
  ],
})
