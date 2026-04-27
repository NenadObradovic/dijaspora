import React from 'react'
import { useTranslation } from 'react-i18next'

const PaginationButtons = ({
  tabs,
  currentTabIndex,
  goToPreviousTab,
  goToNextTab,
}) => {
  const { t } = useTranslation()

  return (
    <div className="flex w-full items-center justify-between gap-y-4 sm:flex-col">
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
      {/* Tab Pagination - Count */}
      <span className="relative flex w-full items-center justify-end gap-6 text-sm font-semibold text-[color:var(--theme-color-700)] sm:hidden">
        {t('step_label')} {currentTabIndex + 1} {t('step_of')} {tabs.length}
      </span>
    </div>
  )
}

export default PaginationButtons
