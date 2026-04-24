import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import '../utils/i18n'
import { generateDocx } from '../utils/generateDocx.js'

import ErrorBoundary from './ErrorBoundary.jsx'
import VotingForm from './voting-form/VotingForm.jsx'
import NextSteps from './NextSteps.jsx'
import EmailTemplate from './EmailTemplate.jsx'
import { isWebView } from '../utils/helper.js'

const App = () => {
  const { t, i18n } = useTranslation()
  const [formData, setFormData] = useState(null)
  const [updateVoter, setUpdateVoter] = useState(false)
  const [docGenerated, setDocGenerated] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState(null)

  const handleFormSubmit = async (data, isUpdateVoter) => {
    setFormData(data)
    setUpdateVoter(isUpdateVoter)
    setIsGenerating(true)
    setGenerateError(null)

    try {
      if (isUpdateVoter) {
        await Promise.all([
          generateDocx(
            '/data/zahtev-za-glasanje.docx',
            data,
            'Zahtev_za_glasanje_u_inostranstvu.docx',
            i18n.language,
          ),
          generateDocx(
            '/data/zahtev-za-upis.docx',
            data,
            'Zahtev_za_upis_u_jedinstveni_biracki_spisak.docx',
            i18n.language,
          ),
        ])
      } else {
        await generateDocx(
          '/data/zahtev-za-glasanje.docx',
          data,
          'Zahtev_za_glasanje_u_inostranstvu.docx',
          i18n.language,
        )
      }

      setDocGenerated(true)
    } catch {
      setGenerateError(t('generate_error'))
    } finally {
      setIsGenerating(false)
    }
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
      {isGenerating && (
        <div className="mb-4 flex items-center justify-center gap-3 rounded-md bg-blue-50 p-4 text-blue-700">
          <svg
            className="h-5 w-5 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {t('generating_docs')}
        </div>
      )}
      {generateError && (
        <div className="mb-4 rounded-md bg-red-100 p-4 text-center text-red-800">
          {generateError}
        </div>
      )}
      <ErrorBoundary errorMessage={t('app_error')}>
        <VotingForm
          onSubmit={handleFormSubmit}
          docGenerated={docGenerated}
          isGenerating={isGenerating}
        />
        {docGenerated && (
          <>
            <NextSteps formData={formData} />
            <EmailTemplate updateVoter={updateVoter} />
          </>
        )}
      </ErrorBoundary>
    </>
  )
}

export default App
