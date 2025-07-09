import React from 'react'
import { useTranslation } from 'react-i18next'

const InputTextField = ({
  field_name,
  data,
  handleChange,
  handleFieldError,
}) => {
  const { t } = useTranslation()

  return (
    <div>
      <input
        type="text"
        name={field_name}
        placeholder={t(field_name)}
        value={data[field_name]}
        onChange={handleChange}
        required
        className="voting-form-field w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-3 text-sm text-[color:var(--theme-color-800)] placeholder-[color:var(--theme-color-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
      />
      {handleFieldError(field_name)}
    </div>
  )
}

export default InputTextField
