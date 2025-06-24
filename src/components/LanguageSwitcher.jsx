import React from 'react'
import '../utils/i18n'
import { useTranslation } from 'react-i18next'

const LanguageSwitcher = () => {
  const { t } = useTranslation()

  return (
    <nav>
      <ul>
        <li>
          <a href="/">{t('language.latin')}</a>
        </li>
        <li>
          <a href="/sr-cyrl/">{t('language.cyrillic')}</a>
        </li>
        <li>
          <a href="/en/">{t('language.english')}</a>
        </li>
      </ul>
    </nav>
  )
}

export default LanguageSwitcher
