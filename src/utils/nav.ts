import { getRelativeLocaleUrl } from 'astro:i18n'
import { tObject } from './i18nStatic'
import astroConfig from '../../astro.config.mjs'

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

/**
 * Maps current page path to the given locale
 *
 * @param path current page path
 * @param locale language locale
 * @returns page path for the given locale
 */
export function getPagePathForLocale(path: string, locale: string): string {
  const pagePathElements = path.trim().split('/').filter(Boolean)
  const currentPath = pagePathElements[pagePathElements.length - 1] //only get the page path or language path for index pages

  const currentPagePath = currentPath === '' ? '/' : currentPath
  // we shouldn't map index page with language
  if (
    currentPagePath === '/' ||
    (astroConfig.i18n?.locales as unknown as string[]).includes(currentPath)
  ) {
    return '/'
  }

  // have to manually map pages as their names are different for english 🤷
  if (locale === 'en') {
    switch (currentPagePath) {
      case 'prirucnik': {
        return 'handbook'
      }
      case 'glasanje': {
        return 'voting'
      }
    }
  }

  switch (currentPagePath) {
    case 'handbook': {
      return 'prirucnik'
    }

    case 'voting': {
      return 'glasanje'
    }
  }

  return currentPagePath
}
