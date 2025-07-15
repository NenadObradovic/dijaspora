import React from 'react'
import { useTranslation } from 'react-i18next'

const EmailTemplate = ({ updateVoter }) => {
  const { t } = useTranslation()
  const email_body = updateVoter ? 'email_body_voter' : 'email_body_non_voter'

  return (
    <div className="mt-6 w-full">
      <h3 className="text-accent-three title mb-4">
        {t('email_heading_example')}
      </h3>
      <pre className="max-w-full overflow-x-auto whitespace-pre-wrap break-words">
        {t(email_body)}
      </pre>
    </div>
  )
}

export default EmailTemplate
