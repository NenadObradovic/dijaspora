import validator from 'validator'

export const validateForm = (data, t) => {
  const newErrors = {}

  if (!data.full_name.trim()) {
    newErrors.full_name = t('full_name_error')
  }

  if (!data.parent_name.trim()) {
    newErrors.parent_name = t('parent_name_error')
  }

  if (!data.jmbg.trim()) {
    newErrors.jmbg = t('jmbg_error')
  } else if (!validator.isNumeric(data.jmbg)) {
    newErrors.jmbg = t('jmbg_error_numeric')
  } else if (data.jmbg.length !== 13) {
    newErrors.jmbg = t('jmbg_error_length')
  }

  if (!data.address.trim()) {
    newErrors.address = t('address_error')
  }

  if (!data.address_abroad.trim()) {
    newErrors.address_abroad = t('address_abroad_error')
  }

  if (!data.country) {
    newErrors.country = t('country_error')
  }

  if (!data.embassy) {
    newErrors.embassy = t('embassy_error')
  }

  if (!data.telephone.trim()) {
    newErrors.telephone = t('telephone_error')
  }

  if (!validator.isEmail(data.email)) {
    newErrors.email = t('email_error')
  }

  if (!data.signature) {
    newErrors.signature = t('signature_error')
  }

  return newErrors
}
