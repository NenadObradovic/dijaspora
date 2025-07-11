import React from 'react'
import { useTranslation } from 'react-i18next'

const PaginationButtonsPersonalData = ({
  tabs,
  currentTabIndex,
  goToPreviousTab,
  goToNextTab,
}) => {
  const { t } = useTranslation()

  return (
    <div className="hidden items-center justify-between gap-x-6 sm:flex sm:w-full">
      {currentTabIndex > 0 && (
        <button
          type="button"
          onClick={goToPreviousTab}
          className="w-full rounded-lg border border-accent-two px-4 py-2 text-sm font-semibold text-accent-two transition duration-200 hover:bg-accent-two hover:text-white"
        >
          {t('previous_step')}
        </button>
      )}
      {currentTabIndex < tabs.length - 1 && (
        <button
          type="button"
          onClick={goToNextTab}
          className="w-full rounded-lg bg-accent-two px-4 py-2 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-accent-two/90"
        >
          {t('next_step')}
        </button>
      )}
    </div>
  )
}

export default PaginationButtonsPersonalData
