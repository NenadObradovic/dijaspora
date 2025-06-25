import { useEffect } from 'react'
import i18n from '../utils/i18n'

const I18nRouterProvider = () => {
  useEffect(() => {
    const pathname = window.location.pathname

    if (pathname.startsWith('/sr-cyrl')) {
      i18n.changeLanguage('sr-cyrl')
    } else if (pathname.startsWith('/en')) {
      i18n.changeLanguage('en')
    } else {
      i18n.changeLanguage('sr')
    }
  }, [])

  return null
}

export default I18nRouterProvider
