import { useState } from 'react'
import { validateForm } from '../utils/validateForm.js'

const TABS = ['check', 'personal-data', 'signature']

export const useFormTabs = (data, t) => {
  const [activeTab, setActiveTab] = useState('check')
  const [errors, setErrors] = useState({})

  const currentTabIndex = TABS.indexOf(activeTab)

  const goToNextTab = () => {
    const formErrors = validateForm(data, activeTab, t)
    setErrors(formErrors)

    if (
      Object.keys(formErrors).length === 0 &&
      currentTabIndex < TABS.length - 1
    ) {
      setActiveTab(TABS[currentTabIndex + 1])
    }
  }

  const goToPreviousTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(TABS[currentTabIndex - 1])
    }
  }

  return {
    tabs: TABS,
    activeTab,
    setActiveTab,
    currentTabIndex,
    errors,
    setErrors,
    goToNextTab,
    goToPreviousTab,
  }
}
