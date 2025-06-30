import { getRelativeLocaleUrl } from 'astro:i18n'
import { tObject } from './i18nStatic'

export function getNavLinks(locale: string): { label: string; path: string }[] {
  const t = tObject(locale, 'header_nav')

  const isEnglish = locale === 'en'

  const homePath = getRelativeLocaleUrl(locale, '/')
  const handbookPath = getRelativeLocaleUrl(
    locale,
    isEnglish ? '/handbook' : '/prirucnik',
  )
  const formPath = getRelativeLocaleUrl(
    locale,
    isEnglish ? '/voting' : '/glasanje',
  )

  return [
    { label: t.home as string, path: homePath },
    { label: t.handbook as string, path: handbookPath },
    { label: t.form as string, path: formPath },
  ]
}
