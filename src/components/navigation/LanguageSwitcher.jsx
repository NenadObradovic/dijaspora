import React, { useEffect, useState } from 'react'
import '../../utils/i18n'
import { useTranslation } from 'react-i18next'

const pages = {
  home: {
    sr: '/prirucnik',
    cyrl: '/приручник',
    en: '/handbook',
  },
  voting: {
    sr: '/glasanje',
    cyrl: '/гласање',
    en: '/voting',
  },
}

function findPageKey(path, lang) {
  return Object.entries(pages).find(([, langs]) => langs[lang] === path)?.[0]
}

function mapPath(pathname, fromLang, toLang) {
  const langPrefix = fromLang === 'sr' ? '' : `/${fromLang}`
  let pathWithoutLang = pathname.startsWith(langPrefix)
    ? pathname.slice(langPrefix.length)
    : pathname

  if (!pathWithoutLang.startsWith('/')) pathWithoutLang = '/' + pathWithoutLang

  pathWithoutLang = decodeURIComponent(pathWithoutLang)

  if (pathWithoutLang === '/' || pathWithoutLang === '') {
    return `/${toLang === 'sr' ? '' : toLang}`
  }

  const pageKey = findPageKey(pathWithoutLang, fromLang)

  if (!pageKey) {
    return toLang === 'sr' ? '/' : `/${toLang}`
  }

  const langPrefixOut = toLang === 'sr' ? '' : `/${toLang}`
  const targetPath = pages[pageKey][toLang]

  return `${langPrefixOut}${targetPath}`
}

const LanguageSwitcher = ({ lang }) => {
  const { t } = useTranslation()
  const [pathname, setPathname] = useState('/')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname)
    }
  }, [])

  const languages = [
    { code: 'sr', path: '/', label: t('language.latin') },
    { code: 'cyrl', path: '/cyrl/', label: t('language.cyrillic') },
    { code: 'en', path: '/en/', label: t('language.english') },
  ]

  return (
    <nav id="nav-language-switcher" className="flex justify-end">
      <ul className="inline-flex gap-x-4 text-sm font-medium text-accent-two">
        {languages
          .filter((langItem) => langItem.code !== lang)
          .map((langItem) => {
            const newHref = mapPath(pathname, lang, langItem.code)
            return (
              <li key={langItem.code}>
                <a
                  href={newHref}
                  className="underline-offset-2 hover:underline"
                >
                  {langItem.label}
                </a>
              </li>
            )
          })}
      </ul>
    </nav>
  )
}

export default LanguageSwitcher
