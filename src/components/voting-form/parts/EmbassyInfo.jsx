import React from 'react'
import { useTranslation } from 'react-i18next'

const EmbassyInfo = ({ embassyData, countryKey, embassyKey }) => {
  const { t } = useTranslation()

  const countryData = embassyData?.embassyByCountry?.[countryKey]

  if (!countryData || !embassyKey) return null

  const isDefault = !embassyKey || embassyKey === 'default'
  const source = isDefault ? countryData : countryData.consulate?.[embassyKey]

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
      <h2 className="mb-2 text-lg font-semibold text-[color:var(--theme-color-800)]">
        {countryData.country}
        {!isDefault && source.embassy ? ` – ${source.embassy}` : ''}
      </h2>

      <p className="text-sm text-[color:var(--theme-color-700)]">
        <span className="font-medium">{t('address_info_title')}:</span>{' '}
        {address}
      </p>

      {emails && emails.length > 0 && (
        <p className="text-sm text-[color:var(--theme-color-700)]">
          <span className="font-medium">{t('email_info_title')}:</span>{' '}
          {emails.map(
            (email, idx) =>
              email && (
                <a
                  key={idx}
                  href={`mailto:${email}`}
                  className="text-accent-one hover:underline"
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
          <span className="font-medium">{t('phone_info_title')}:</span>{' '}
          {phones.map(
            (phone, idx) =>
              phone && (
                <a
                  key={idx}
                  href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                  className="text-accent-one hover:underline"
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
          className="mt-2 inline-block rounded-md bg-accent-one px-4 py-2 text-sm font-medium text-white hover:bg-accent-one/90"
        >
          {t('google_maps_info_title')}
        </a>
      )}
    </div>
  )
}

export default EmbassyInfo
