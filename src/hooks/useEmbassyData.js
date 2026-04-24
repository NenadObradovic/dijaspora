import { useState, useEffect } from 'react'

export const useEmbassyData = (language) => {
  const [embassyData, setEmbassyData] = useState(null)
  const [embassyCyrlData, setEmbassyCyrlData] = useState(null)

  useEffect(() => {
    const controller = new AbortController()
    const { signal } = controller

    const isCyrl = language === 'cyrl'
    const path = isCyrl ? '/data/embassy-cyrl.json' : '/data/embassy.json'

    fetch(path, { signal })
      .then((res) => res.json())
      .then((json) => setEmbassyData(json))
      .catch((err) => {
        if (err.name !== 'AbortError') {
          // eslint-disable-next-line no-console
          console.error('Greška pri učitavanju JSON-a:', err)
        }
      })

    if (language === 'sr') {
      fetch('/data/embassy-cyrl.json', { signal })
        .then((res) => res.json())
        .then((json) => setEmbassyCyrlData(json))
        .catch((err) => {
          if (err.name !== 'AbortError') {
            // eslint-disable-next-line no-console
            console.error('Greška pri učitavanju JSON-a:', err)
          }
        })
    } else {
      setEmbassyCyrlData(null)
    }

    return () => controller.abort()
  }, [language])

  const availableCountries =
    language === 'cyrl'
      ? (embassyData?.availableCountries ?? {})
      : Object.fromEntries(
          Object.entries(embassyData?.availableCountries ?? {}).sort((a, b) =>
            a[1].localeCompare(b[1], 'en', { sensitivity: 'base' }),
          ),
        )

  const embassyByCountry = embassyData?.embassyByCountry ?? {}

  return { embassyData, embassyCyrlData, availableCountries, embassyByCountry }
}
