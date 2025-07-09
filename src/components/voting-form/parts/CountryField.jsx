import React from 'react'
import { useTranslation } from 'react-i18next'

const CountryField = ({
  availableCountries,
  availableCities,
  data,
  handleChange,
  handleFieldError,
}) => {
  const { t } = useTranslation()

  return (
    <>
      <div>
        <select
          name="country"
          value={data.country}
          onChange={handleChange}
          required
          className="voting-form-field w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-3 text-sm text-[color:var(--theme-color-800)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
          style={{
            color: data.country
              ? 'var(--theme-color-800)'
              : 'var(--theme-color-500)',
          }}
        >
          <option value="">{t('country')}</option>
          {Object.entries(availableCountries).map(([slug, countryName]) => (
            <option key={slug} value={slug}>
              {countryName}
            </option>
          ))}
        </select>
        {handleFieldError('country')}
      </div>
      {data.country && availableCities && (
        <>
          <div>
            <select
              name="city"
              value={data.city}
              onChange={handleChange}
              required
              className="voting-form-field w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-3 text-sm text-[color:var(--theme-color-800)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
              style={{
                color: data.city
                  ? 'var(--theme-color-800)'
                  : 'var(--theme-color-500)',
              }}
            >
              <option value="">{t('city')}</option>
              {availableCities.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {handleFieldError('city')}
          </div>
        </>
      )}
    </>
  )
}

export default CountryField
