import React from 'react'
import { useTranslation } from 'react-i18next'
import { toSafeMailto } from '../utils/toSafeMailto.js'

const NextSteps = ({ formData }) => {
  const { t } = useTranslation()
  const embassy_email = formData.embassy_email ?? []

  return (
    <section className="mt-6 w-full">
      <h3 className="text-accent-three title mb-4">{t('next_steps_title')}</h3>

      <ul className="list-content list-inside list-disc">
        <li>{t('next_steps_step_1')}</li>
        <li>{t('next_steps_step_2')}</li>
        <li>{t('next_steps_step_3')}</li>
      </ul>

      {embassy_email.length > 0 && (
        <p className="mt-4 font-medium">
          {t('email_button_example')}{' '}
          {embassy_email
            .map((email) => ({ email, href: toSafeMailto(email) }))
            .filter((x) => Boolean(x.href))
            .map(({ email, href }, index, arr) => (
              <React.Fragment key={`${email}-${index}`}>
                <a
                  className="ml-2 text-accent-two underline-offset-2 hover:underline"
                  href={href}
                >
                  {email}
                </a>
                {index < arr.length - 1 && ' '}
              </React.Fragment>
            ))}
        </p>
      )}
    </section>
  )
}

export default NextSteps
