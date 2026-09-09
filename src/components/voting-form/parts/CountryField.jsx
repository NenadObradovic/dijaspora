import React from 'react'
import { useTranslation } from 'react-i18next'
import InputTextField from './InputTextField.jsx'

const CountryField = ({
  availableCountries,
  availableEmbassy,
  embassyByCountry,
  data,
  handleChange,
  handleFieldError,
  hasError,
}) => {
  const { t } = useTranslation()

  const isNonResident = Boolean(embassyByCountry?.[data.country]?.covered_by)

  return (
    <>
      <div>
        <label htmlFor="country" className="mb-1 block text-sm font-medium">
          {t('country')}
        </label>
        <select
          id="country"
          name="country"
          value={data.country}
          onChange={handleChange}
          required
          aria-invalid={Boolean(hasError?.country)}
          aria-describedby="country-help country-error"
          className={`voting-form-field w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)] ${
            data.country
              ? 'text-[color:var(--theme-color-800)]'
              : 'text-[color:var(--theme-color-500)]'
          }`}
        >
          <option value="">{t('country')}</option>
          {Object.entries(availableCountries).map(([slug, countryName]) => (
            <option key={slug} value={slug}>
              {countryName}
            </option>
          ))}
        </select>
        {handleFieldError('country', {
          helperId: 'country-help',
          errorId: 'country-error',
        })}
      </div>
      {data.country && availableEmbassy && (
        <>
          {isNonResident && (
            <p className="text-sm text-[color:var(--theme-color-500)]">
              {t('non_resident_note')}
            </p>
          )}
          <div>
            <label htmlFor="embassy" className="mb-1 block text-sm font-medium">
              {t('embassy')}
            </label>
            <select
              id="embassy"
              name="embassy"
              value={data.embassy}
              onChange={handleChange}
              required
              aria-invalid={Boolean(hasError?.embassy)}
              aria-describedby="embassy-help embassy-error"
              className={`voting-form-field w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)] ${
                data.embassy
                  ? 'text-[color:var(--theme-color-800)]'
                  : 'text-[color:var(--theme-color-500)]'
              }`}
            >
              <option value="">{t('embassy')}</option>
              {availableEmbassy.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {handleFieldError('embassy', {
              helperId: 'embassy-help',
              errorId: 'embassy-error',
            })}
          </div>
          <InputTextField
            field_name="city"
            data={data}
            handleChange={handleChange}
            handleFieldError={handleFieldError}
            hasError={hasError}
          />
        </>
      )}
    </>
  )
}

export default CountryField
