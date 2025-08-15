import React from 'react'
import { useTranslation } from 'react-i18next'

const EmbassyInfo = ({ embassyData, countryKey, embassyKey }) => {
  const { t } = useTranslation()

  const countryData = embassyData?.embassyByCountry?.[countryKey]

  if (!countryData || !embassyKey) return null

  const isDefault = !embassyKey || embassyKey === 'default'
  let isHonor = false
  let source = countryData

  if (!isDefault) {
    if (countryData?.honorary_consulate?.[embassyKey]) {
      source = countryData.honorary_consulate?.[embassyKey]

      isHonor = true
    } else {
      source = countryData.consulate?.[embassyKey]
    }
  }

  if (!source) return null

  const address = source.address || ''
  const emails = Array.isArray(source.email)
    ? source.email
    : typeof source.email !== 'undefined' && [source.email]
  const phones = Array.isArray(source.telephone)
    ? source.telephone
    : typeof source.telephone !== 'undefined' && [source.telephone]
  const gmap = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address,
  )}`

  return (
    <div className="rounded-lg border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] p-4 shadow-sm">
      <h2 className="title mb-2 text-xl text-accent-two">
        {countryData.country}
        {!isDefault && source.embassy ? ` – ${source.embassy}` : ''}
      </h2>

      {isHonor && source?.honor && (
        <h4 className="text-accent-three title mb-4">
          <span className="text-sm text-[color:var(--theme-color-700)]">
            {t('honor_info_title')}
          </span>{' '}
          {source.honor}
        </h4>
      )}

      <p className="text-sm text-[color:var(--theme-color-700)]">
        <span className="font-medium">{t('address_info_title')}</span> {address}
      </p>

      {emails && emails.length > 0 && (
        <p className="text-sm text-[color:var(--theme-color-700)]">
          <span className="font-medium">{t('email_info_title')}</span>{' '}
          {emails.map(
            (email, idx) =>
              email && (
                <a
                  key={idx}
                  href={`mailto:${email}`}
                  className="text-accent-two underline-offset-2 hover:underline"
                >
                  {email}
                  {idx < emails.length - 1 ? ', ' : ''}
                </a>
              ),
          )}
        </p>
      )}

      {phones && phones.length > 0 && (
        <p className="text-sm text-[color:var(--theme-color-700)]">
          <span className="font-medium">{t('phone_info_title')}</span>{' '}
          {phones.map(
            (phone, idx) =>
              phone && (
                <a
                  key={idx}
                  href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                  className="text-accent-two underline-offset-2 hover:underline"
                >
                  {phone}
                  {idx < phones.length - 1 ? ', ' : ''}
                </a>
              ),
          )}
        </p>
      )}

      {address && (
        <a
          href={gmap}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block rounded-md bg-accent-two px-4 py-2 text-sm font-medium text-white hover:bg-accent-two/90"
        >
          {t('google_maps_info_title')}
        </a>
      )}
    </div>
  )
}

export default EmbassyInfo
