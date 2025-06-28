import React from 'react'
import { useTranslation } from 'react-i18next'
import {
  EMAIL_BODY_NON_VOTER,
  EMAIL_BODY_VOTER,
} from '../constants/emailContants.js'

const EmailTemplate = ({ updateVoter }) => {
  const { t } = useTranslation()
  const body = updateVoter ? EMAIL_BODY_VOTER : EMAIL_BODY_NON_VOTER

  return (
    <div className="mt-6 w-full">
      <h3 className="text-l text-accent-three title mb-2">
        {t('email_heading_example')}
      </h3>
      <p className="mt-6">{body}</p>
    </div>
  )
}

export default EmailTemplate
