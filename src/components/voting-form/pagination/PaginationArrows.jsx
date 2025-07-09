import React from 'react'
import { useTranslation } from 'react-i18next'

const PaginationArrows = ({
  tabs,
  currentTabIndex,
  goToPreviousTab,
  goToNextTab,
}) => {
  const { t } = useTranslation()

  return (
    <div className="relative flex w-full items-center justify-between gap-6 sm:hidden">
      <button
        onClick={goToPreviousTab}
        disabled={currentTabIndex === 0}
        className={`align-center inline-flex text-sm text-accent-two underline-offset-2 transition-colors duration-200 hover:underline ${
          currentTabIndex === 0 ? 'hidden' : ''
        }`}
        aria-label={t('previous_step')}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          className="relative top-[1px] h-auto w-5 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
        </svg>
        {t('previous_step')}
      </button>
      <button
        onClick={goToNextTab}
        disabled={currentTabIndex === tabs.length - 1}
        className={`align-center ml-auto inline-flex text-sm text-accent-two underline-offset-2 transition-colors duration-200 hover:underline ${
          currentTabIndex === tabs.length - 1 ? 'hidden' : ''
        }`}
        aria-label={t('next_step')}
      >
        {t('next_step')}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          className="relative top-[1px] h-auto w-5 fill-current"
          viewBox="0 0 24 24"
        >
          <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
        </svg>
      </button>
    </div>
  )
}

export default PaginationArrows
