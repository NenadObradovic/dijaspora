import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import '../utils/i18n'
import { generateDocx } from '../utils/generateDocx.js'

import VotingForm from './voting-form/VotingForm.jsx'
import NextSteps from './NextSteps.jsx'
import EmailTemplate from './EmailTemplate.jsx'
import { isWebView } from '../utils/helper.js'

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

  return (
    <>
      <h1 className="title mb-6 bg-gradient-to-r from-accent-two/85 via-accent-one/85 to-accent-two/85 bg-clip-text text-center text-3xl text-transparent dark:from-accent-two dark:via-accent-one dark:to-accent-two">
        {t('form_title')}
      </h1>
      {!docGenerated && isWebView() && (
        <div className="mb-4 rounded-md bg-yellow-100 p-4 text-center text-yellow-800">
          ⚠️ {t('web_view_error')}
        </div>
      )}
      <VotingForm onSubmit={handleFormSubmit} docGenerated={docGenerated} />
      {docGenerated && (
        <>
          <NextSteps formData={formData} />
          <EmailTemplate updateVoter={updateVoter} />
        </>
      )}
    </>
  )
}

export default App
