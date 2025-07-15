import validator from 'validator'
import { isValidPhoneNumber } from 'libphonenumber-js'

export const validateForm = (data, step, t) => {
  const errors = {}

  if (step === 'personal-data') {
    if (!data.full_name.trim()) {
      errors.full_name = t('full_name_error')
    }

    if (!data.parent_name.trim()) {
      errors.parent_name = t('parent_name_error')
    }

    if (!data.jmbg.trim()) {
      errors.jmbg = t('jmbg_error')
    } else if (!validator.isNumeric(data.jmbg)) {
      errors.jmbg = t('jmbg_error_numeric')
    } else if (data.jmbg.length !== 13) {
      errors.jmbg = t('jmbg_error_length')
    }

    if (!data.address.trim()) {
      errors.address = t('address_error')
    }

    if (!data.address_abroad.trim()) {
      errors.address_abroad = t('address_abroad_error')
    }

    if (!data.country) {
      errors.country = t('country_error')
    }

    if (!data.embassy) {
      errors.embassy = t('embassy_error')
    }

    if (!data.telephone.trim()) {
      errors.telephone = t('telephone_error')
    } else if (!isValidPhoneNumber(data.telephone)) {
      errors.telephone = t('telephone_error_format')
    }

    if (!validator.isEmail(data.email)) {
      errors.email = t('email_error')
    }
  } else if (step === 'signature') {
    if (!data.signature) {
      errors.signature = t('signature_error')
    }
  } else if (step === 'all') {
    if (!data.full_name.trim()) {
      errors.full_name = t('full_name_error')
    }

    if (!data.parent_name.trim()) {
      errors.parent_name = t('parent_name_error')
    }

    if (!data.jmbg.trim()) {
      errors.jmbg = t('jmbg_error')
    } else if (!validator.isNumeric(data.jmbg)) {
      errors.jmbg = t('jmbg_error_numeric')
    } else if (data.jmbg.length !== 13) {
      errors.jmbg = t('jmbg_error_length')
    }

    if (!data.address.trim()) {
      errors.address = t('address_error')
    }

    if (!data.address_abroad.trim()) {
      errors.address_abroad = t('address_abroad_error')
    }

    if (!data.country) {
      errors.country = t('country_error')
    }

    if (!data.embassy) {
      errors.embassy = t('embassy_error')
    }

    if (!data.telephone.trim()) {
      errors.telephone = t('telephone_error')
    } else if (!isValidPhoneNumber(data.telephone)) {
      errors.telephone = t('telephone_error_format')
    }

    if (!validator.isEmail(data.email)) {
      errors.email = t('email_error')
    }

    if (!data.signature) {
      errors.signature = t('signature_error')
    }
  }

  return errors
}
