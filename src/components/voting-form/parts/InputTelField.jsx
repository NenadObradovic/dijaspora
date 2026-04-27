import React from 'react'
import { useTranslation } from 'react-i18next'

const InputTelField = ({
  field_name,
  placeholder,
  data,
  handleChange,
  handleFieldError,
  hasError,
}) => {
  const { t } = useTranslation()
  const inputId = field_name
  const helperId = `${field_name}-help`
  const errorId = `${field_name}-error`
  const describedBy = `${helperId} ${errorId}`

  return (
    <div>
      <label htmlFor={inputId} className="mb-1 block text-sm font-medium">
        {t(field_name)}
      </label>
      <input
        type="tel"
        id={inputId}
        name={field_name}
        placeholder={placeholder}
        value={data[field_name]}
        onChange={handleChange}
        required
        aria-invalid={Boolean(hasError?.[field_name])}
        aria-describedby={describedBy}
        className="voting-form-field w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-3 text-sm text-[color:var(--theme-color-800)] placeholder-[color:var(--theme-color-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
      />
      {handleFieldError(field_name, { helperId, errorId })}
    </div>
  )
}

export default InputTelField
