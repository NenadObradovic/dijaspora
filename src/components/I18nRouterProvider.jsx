import { useEffect, useState } from 'react'
import i18n from '../utils/i18n'

const I18nRouterProvider = ({ children, initialLang }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let lang

    const pathname = window.location.pathname
    if (pathname.startsWith('/cyrl')) lang = 'cyrl'
    else if (pathname.startsWith('/en')) lang = 'en'
    else lang = 'sr'

    i18n.changeLanguage(lang).then(() => setLoading(false))
  }, [initialLang])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
      </div>
    )
  }

  return children
}

export default I18nRouterProvider
