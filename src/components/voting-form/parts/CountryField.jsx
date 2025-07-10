import React from 'react'
import { useTranslation } from 'react-i18next'
import InputTextField from './InputTextField.jsx'

const CountryField = ({
  availableCountries,
  availableEmbassy,
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
      {data.country && availableEmbassy && (
        <>
          <div>
            <select
              name="embassy"
              value={data.embassy}
              onChange={handleChange}
              required
              className="voting-form-field w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-3 text-sm text-[color:var(--theme-color-800)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
              style={{
                color: data.embassy
                  ? 'var(--theme-color-800)'
                  : 'var(--theme-color-500)',
              }}
            >
              <option value="">{t('embassy')}</option>
              {availableEmbassy.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {handleFieldError('embassy')}
          </div>
          <InputTextField
            field_name="city"
            data={data}
            handleChange={handleChange}
            handleFieldError={handleFieldError}
          />
        </>
      )}
    </>
  )
}

export default CountryField
