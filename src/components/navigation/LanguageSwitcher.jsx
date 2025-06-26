import React from 'react'
import '../../utils/i18n'
import { useTranslation } from 'react-i18next'

const LanguageSwitcher = ({ lang }) => {
  const { t } = useTranslation()

  const languages = [
    { code: 'sr', path: '/', label: t('language.latin') },
    { code: 'sr-cyrl', path: '/sr-cyrl/', label: t('language.cyrillic') },
    { code: 'en', path: '/en/', label: t('language.english') },
  ]

  return (
    <nav id="nav-language-switcher" className="flex justify-end">
      <ul className="inline-flex gap-x-4 text-sm font-medium text-accent-two">
        {languages
          .filter((langItem) => langItem.code !== lang)
          .map((langItem) => (
            <li key={langItem.code}>
              <a
                href={langItem.path}
                className="underline-offset-2 hover:underline"
              >
                {langItem.label}
              </a>
            </li>
          ))}
      </ul>
    </nav>
  )
}

export default LanguageSwitcher
