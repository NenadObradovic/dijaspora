import React from 'react'
import { useTranslation } from 'react-i18next'
import { toSafeMailto } from '../utils/toSafeMailto.js'
import {
  generateIcsReminder,
  getRequestDeadlineDate,
} from '../utils/generateIcsReminder.js'

const NextSteps = ({ formData }) => {
  const { t } = useTranslation()
  const embassy_email = formData.embassy_email ?? []
  const deadlineDate = getRequestDeadlineDate()

  const handleAddToCalendar = () => {
    generateIcsReminder({
      title: t('deadline_ics_title'),
      description: t('deadline_ics_description'),
    })
  }

  return (
    <section className="mt-6 w-full">
      <h3 className="text-accent-three title mb-4">{t('next_steps_title')}</h3>

      <ul className="list-content list-inside list-disc">
        <li>{t('next_steps_step_1')}</li>
        <li>{t('next_steps_step_2')}</li>
        <li>{t('next_steps_step_3')}</li>
        <li>{t('next_steps_step_4')}</li>
      </ul>

      {deadlineDate && (
        <button
          type="button"
          onClick={handleAddToCalendar}
          className="mt-4 inline-flex items-center gap-2 rounded-md border border-[color:var(--theme-color-300)] px-3 py-1.5 text-xs font-medium text-[color:var(--theme-color-600)] transition-colors duration-150 hover:border-accent-two hover:text-accent-two"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            className="fill-current"
          >
            <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2zm0 16H5V10h14v10zM5 8V6h14v2H5zm7 3h5v5h-5z" />
          </svg>
          {t('add_deadline_to_calendar')}
        </button>
      )}

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
