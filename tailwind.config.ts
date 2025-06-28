import type { Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'

export default {
  content: [
    './src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}',
    '!./src/pages/og-image/[slug].png.ts',
  ],
  corePlugins: {
    // disable some core plugins as they are included in the css, even when unused
    borderOpacity: false,
    fontVariantNumeric: false,
    ringOffsetColor: false,
    ringOffsetWidth: false,
    scrollSnapType: false,
    textOpacity: false,
    touchAction: false,
  },
  darkMode: ['class', '[data-theme="dark"]'],
  plugins: [
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    require('@tailwindcss/typography'),
    plugin(({ addComponents }) => {
      addComponents({
        '.citrus-link': {
          '&:hover': {
            '@apply underline underline-offset-2': {},
          },
          '@apply no-underline': {},
        },
        '.title': {
          '@apply font-semibold text-accent-base': {},
        },
        '.data-footnote-backref': {
          '&:hover': {
            '@apply no-underline brightness-110': {},
          },
          '@apply inline-flex bg-accent-two text-bgColor text-xs h-4 w-4 rounded-sm items-center justify-center':
            {},
        },
      })
    }),
  ],

  theme: {
    extend: {
      screens: {
        xs: '320px', // Add xs size
      },
      maxWidth: {
        lg: '32rem', // default 32rem (512px)
        xl: '36rem', // default 36rem (576px)
        '2xl': '42rem', // default 42rem (672px)
        '3xl': '48rem', // default 48rem (768px)
        '4xl': '54rem', // !!! // default 56rem (896px)
        '5xl': '64rem', // default 64rem (1024px)
        '6xl': '76rem', // !!! // default 72rem (1152px)
      },
      colors: {
        color: {
          950: 'var(--theme-color-950)',
          900: 'var(--theme-color-900)',
          850: 'var(--theme-color-850)',
          800: 'var(--theme-color-800)',
          750: 'var(--theme-color-750)',
          700: 'var(--theme-color-700)',
          650: 'var(--theme-color-650)',
          600: 'var(--theme-color-600)',
          550: 'var(--theme-color-550)',
          500: 'var(--theme-color-500)',
          450: 'var(--theme-color-450)',
          400: 'var(--theme-color-400)',
          350: 'var(--theme-color-350)',
          300: 'var(--theme-color-300)',
          250: 'var(--theme-color-250)',
          200: 'var(--theme-color-200)',
          150: 'var(--theme-color-150)',
          100: 'var(--theme-color-100)',
          75: 'var(--theme-color-75)',
          50: 'var(--theme-color-50)',
        },
        bgColor: 'hsl(var(--theme-bg) / <alpha-value>)',
        textColor: 'var(--theme-text)',
        'accent-base': 'hsl(var(--theme-accent-base) / <alpha-value>)',
        'accent-one': 'hsl(var(--theme-accent-one) / <alpha-value>)',
        'accent-two': 'hsl(var(--theme-accent-two) / <alpha-value>)',
        link: 'hsl(var(--theme-link) / <alpha-value>)',
        accent: 'var(--theme-accent)',
        quote: 'hsl(var(--theme-quote) / <alpha-value>)',
        lightest: 'var(--theme-lightest)',
        lighter: 'var(--theme-lighter)',
        light: 'var(--theme-light)',
        'special-lightest': 'var(--theme-special-lightest)',
        'special-lighter': 'var(--theme-special-lighter)',
        'special-light': 'var(--theme-special-light)',
      },
      fontFamily: {
        // Add any custom fonts here
        sans: ['SFProRounded', ...fontFamily.sans],
        serif: ['CascadiaCode', ...fontFamily.serif],
      },
      transitionProperty: {
        height: 'height',
      },
      // @ts-expect-error - Remove above once tailwindcss exposes theme type
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              '@apply citrus-link': '',
            },
            blockquote: {
              '@apply font-normal text-quote border-l-0 px-4 [&>p:first-of-type]:mt-0 [&>p:last-of-type]:mb-0':
                '',
              'p::before': {
                "@apply leading-none font-serif font-medium relative content-['\"'] text-2xl text-lightest top-[0.31125rem] md:top-[0.31125rem] -ms-4 me-0.5":
                  '',
              },
              'p::after': {
                "@apply leading-none font-serif font-medium relative content-['\"'] text-2xl text-lightest top-[0.31125rem] md:top-[0.31125rem] ms-0":
                  '',
              },
            },
            pre: {
              '@apply relative py-1.5': '',
            },

            code: {
              '@apply px-2 py-1 text-sm rounded-lg bg-color-150': '',
            },

            kbd: {
              '@apply text-textColor bg-special-lighter border-color-100 shadow-[0px_2.5px_0px_rgba(0,0,0,0.25)]':
                '',
            },
            hr: {
              '@apply border-t border-solid border-color-200': '',
            },
            strong: {
              fontWeight: '700',
            },
            sup: {
              '&:hover': {
                '@apply brightness-110': '',
              },
              '@apply bg-accent-two ms-0.5 px-1 rounded-sm text-bgColor': '',
              a: {
                '&:hover': {
                  '@apply no-underline': '',
                },
                '@apply text-bgColor': '',
              },
            },

            /* Table */
            table: {
              '@apply overflow-hidden rounded-lg': '',
            },
            'tbody tr': {
              borderBottomWidth: 'none',
            },
            thead: {
              borderBottomWidth: 'none',
              '@apply bg-color-50': '',
            },
            'thead th': {
              '@apply items-center min-h-8': '',
            },
            'td, th': {
              '@apply px-4 py-1': '',
            },
            'th[align="center"], td[align="center"]': {
              'text-align': 'center',
            },
            'th[align="right"], td[align="right"]': {
              'text-align': 'right',
            },
            'th[align="left"], td[align="left"]': {
              'text-align': 'left',
            },
            'tbody tr:nth-child(odd)': {
              '@apply bg-color-100': '',
            },
            'tbody tr:nth-child(even)': {
              '@apply bg-color-50': '',
            },
          },
        },
        citrus: {
          css: {
            '--tw-prose-body': theme('colors.textColor / 1'),
            '--tw-prose-bold': theme('colors.textColor / 1'),
            '--tw-prose-bullets': theme('colors.textColor / 1'),
            '--tw-prose-code': theme('colors.accent / 1'),
            '--tw-prose-headings': theme('colors.accent-base / 1'),
            '--tw-prose-links': theme('colors.link / 1'),
            '--tw-prose-quotes': theme('colors.quote / 1'),
            'code::before': { content: 'none' },
            'code::after': { content: 'none' },
          },
        },
        sm: {
          css: {
            code: {
              fontSize: theme('fontSize.sm')[0],
              fontWeight: '400',
            },
          },
        },
      }),
    },
  },
  safelist: [
    'bg-color-950',
    'bg-color-900',
    'bg-color-850',
    'bg-color-800',
    'bg-color-750',
    'bg-color-700',
    'bg-color-650',
    'bg-color-600',
    'bg-color-550',
    'bg-color-500',
    'bg-color-450',
    'bg-color-400',
    'bg-color-350',
    'bg-color-300',
    'bg-color-250',
    'bg-color-200',
    'bg-color-150',
    'bg-color-100',
    'bg-color-75',
    'bg-color-50',
    'text-color-950',
    'text-color-900',
    'text-color-850',
    'text-color-800',
    'text-color-750',
    'text-color-700',
    'text-color-650',
    'text-color-600',
    'text-color-550',
    'text-color-500',
    'text-color-450',
    'text-color-400',
    'text-color-350',
    'text-color-300',
    'text-color-250',
    'text-color-200',
    'text-color-150',
    'text-color-100',
    'text-color-75',
    'text-color-50',
  ],
} satisfies Config
