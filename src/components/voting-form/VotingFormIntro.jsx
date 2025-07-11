import React from 'react'
import { useTranslation } from 'react-i18next'

const VotingFormIntro = () => {
  const { t } = useTranslation()

  return (
    <div className="mb-2 mt-6 rounded-lg border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] p-6 shadow-sm">
      <p className="mb-4 text-sm">{t('voting_intro_paragraph_1')}</p>
      <p className="mb-4 text-sm">{t('voting_intro_paragraph_2')}</p>
      <p className="text-sm font-medium text-[color:var(--theme-accent)]">
        {t('voting_intro_note')}
      </p>
    </div>
  )
}

export default VotingFormIntro
