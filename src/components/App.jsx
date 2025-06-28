import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import '../utils/i18n'
import VotingForm from './VotingForm.jsx'
import EmailTemplate from './EmailTemplate.jsx'
import { generateDocx } from '../utils/generateDocx.js'
import {
  EMAIL_SUBJECT,
  EMAIL_BODY_VOTER,
  EMAIL_BODY_NON_VOTER,
} from '../constants/emailContants.js'

const App = () => {
  const { t } = useTranslation()
  const [formData, setFormData] = useState(null)
  const [updateVoter, setUpdateVoter] = useState(false)
  const [docGenerated, setDocGenerated] = useState(false)

  const handleFormSubmit = async (data, isUpdateVoter) => {
    setFormData(data)
    setUpdateVoter(isUpdateVoter)

    if (isUpdateVoter) {
      await Promise.all([
        generateDocx(
          '/data/zahtev-za-glasanje.docx',
          data,
          'Zahtev_za_glasanje_u_inostranstvu.docx',
        ),
        generateDocx(
          '/data/zahtev-za-upis.docx',
          data,
          'Zahtev_za_upis_u_jedinstveni_biracki_spisak.docx',
        ),
      ])
    } else {
      await generateDocx(
        '/data/zahtev-za-glasanje.docx',
        data,
        'Zahtev_za_glasanje_u_inostranstvu.docx',
      )
    }

    setDocGenerated(true)
  }

  const handleSendEmail = () => {
    if (!formData || typeof formData?.email === 'undefined') {
      return
    }

    const email = formData?.email || ''
    const subject = EMAIL_SUBJECT
    const body = updateVoter ? EMAIL_BODY_VOTER : EMAIL_BODY_NON_VOTER

    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
  }

  return (
    <>
      <h1 className="title mb-6 bg-gradient-to-r from-accent-two/85 via-accent-one/85 to-accent-two/85 bg-clip-text text-3xl text-transparent dark:from-accent-two dark:via-accent-one dark:to-accent-two">
        {t('form_title')}
      </h1>
      <VotingForm onSubmit={handleFormSubmit} />
      {docGenerated && (
        <>
          <EmailTemplate updateVoter={updateVoter} />
          <button
            onClick={handleSendEmail}
            className="mt-6 rounded-lg bg-accent-one px-6 py-3 font-semibold text-white shadow-md transition duration-200 hover:bg-accent-one/90"
          >
            {t('email_button_example')}
          </button>
        </>
      )}
    </>
  )
}

export default App
