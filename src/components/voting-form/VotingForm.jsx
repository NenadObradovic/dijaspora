import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { JEDINSTVEN_BIRACKI_SPISAK_URL } from '../../constants/global.js'
import { validateForm } from '../../utils/validateForm.js'

import EmbassyInfo from './parts/EmbassyInfo.jsx'
import PaginationButtons from './pagination/PaginationButtons.jsx'
import PaginationArrows from './pagination/PaginationArrows.jsx'
import PaginationArrowsPersonalData from './pagination/PaginationArrowsPersonalData.jsx'
import PaginationButtonsPersonalData from './pagination/PaginationButtonsPersonalData.jsx'
import Signature from './parts/Signature.jsx'
import InputTextField from './parts/InputTextField.jsx'
import InputNumberField from './parts/InputNumberField.jsx'
import InputTelField from './parts/InputTelField.jsx'
import InputEmailField from './parts/InputEmailField.jsx'
import CountryField from './parts/CountryField.jsx'

const VotingForm = ({ onSubmit, docGenerated }) => {
  const { t, i18n } = useTranslation()
  const [isMobile, setIsMobile] = useState(false)
  const [errors, setErrors] = useState({})
  const [updateVoter, setUpdateVoter] = useState(false)

  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth <= 640)
    }
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const [data, setData] = useState({
    full_name: '',
    parent_name: '',
    jmbg: '',
    address: '',
    address_abroad: '',
    country: '',
    city: '',
    telephone: '',
    email: '',
    signature: '',
  })

  const [embassyData, setEmbassyData] = useState(null)
  useEffect(() => {
    const embassyData =
      'cyrl' === i18n.language
        ? '/data/embassy-cyrl.json'
        : '/data/embassy.json'

    fetch(embassyData)
      .then((res) => res.json())
      .then((json) => setEmbassyData(json))
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Greška pri učitavanju JSON-a:', err)
      })
  }, [])

  const [availableCities, setAvailableCities] = useState()
  const availableCountries = embassyData?.availableCountries || {}
  const citiesByCountry = embassyData?.citiesByCountry || {}

  const [activeTab, setActiveTab] = useState('check')
  const tabs = ['check', 'personal-data', 'signature']
  const currentTabIndex = tabs.indexOf(activeTab)

  const goToNextTab = () => {
    if (currentTabIndex < tabs.length - 1) {
      setActiveTab(tabs[currentTabIndex + 1])
    }
  }

  const goToPreviousTab = () => {
    if (currentTabIndex > 0) {
      setActiveTab(tabs[currentTabIndex - 1])
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'country' ? { city: '' } : {}),
    }))

    if (name === 'country') {
      if (!citiesByCountry[value]) {
        setAvailableCities([])
        return
      }

      const cityOptions = []

      cityOptions.push({
        value: 'default',
        label: citiesByCountry[value].address,
      })

      if (citiesByCountry[value].consulate) {
        Object.entries(citiesByCountry[value].consulate).forEach(
          ([slug, consulate]) => {
            cityOptions.push({
              value: slug,
              label: consulate.address,
            })
          },
        )
      }

      setAvailableCities(cityOptions)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const formErrors = validateForm(data)

    setErrors(formErrors)

    let handleErrorsActiveTab = { ...formErrors }
    delete handleErrorsActiveTab.signature

    if (Object.keys(handleErrorsActiveTab).length > 0) {
      setActiveTab('personal-data')
    }

    if (Object.keys(formErrors).length === 0) {
      onSubmit(data, updateVoter)
    }
  }

  const handleFieldError = (field, hasDefault = true) => {
    return errors[field] ? (
      <div className="error text-sm text-red-500">{errors[field]}</div>
    ) : hasDefault ? (
      <span className="text-sm text-[color:var(--theme-color-400)]">
        {t(field + '_description')}
      </span>
    ) : null
  }

  return (
    <div className="relative flex w-full flex-col-reverse gap-6 sm:flex-col">
      <EmbassyInfo
        embassyData={embassyData}
        countryKey={data.country}
        cityKey={data.city}
      />
      {!docGenerated && (
        <div className="flex w-full max-w-screen-lg flex-col gap-8 py-6 sm:grid sm:grid-cols-[250px_1fr]">
          <div className="flex flex-wrap justify-between gap-y-8 sm:flex-col sm:justify-start">
            {/* Tab Navigation */}
            <div className="flex shrink-0 flex-col gap-y-4 sm:w-full sm:flex-col">
              {tabs.map((tab, index) => {
                if (isMobile && tab !== activeTab) {
                  return null
                }

                return (
                  <div key={index} className="relative flex items-center">
                    {/* Number Circle */}
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium ${index === currentTabIndex ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-700'}`}
                    >
                      {index + 1}
                    </div>
                    <button
                      onClick={() => setActiveTab(tab)}
                      className={`rounded-t-md px-2 py-1 text-sm font-medium ${
                        activeTab === tab
                          ? 'text-[color:var(--theme-color-800)]'
                          : 'hidden text-[color:var(--theme-color-500)] hover:text-[color:var(--theme-color-800)] sm:inline-block'
                      }`}
                    >
                      {t(tab.replace('-', '_') + '_tab')}
                    </button>
                  </div>
                )
              })}
            </div>
            <PaginationButtons
              tabs={tabs}
              currentTabIndex={currentTabIndex}
              goToPreviousTab={goToPreviousTab}
              goToNextTab={goToNextTab}
            />
            <PaginationArrows
              tabs={tabs}
              currentTabIndex={currentTabIndex}
              goToPreviousTab={goToPreviousTab}
              goToNextTab={goToNextTab}
            />
          </div>
          {/* Tab Content */}
          <div>
            <form
              onSubmit={handleSubmit}
              className="space-y-6 text-[color:var(--theme-color-700)]"
            >
              {activeTab === 'check' && (
                <>
                  <div>
                    <p>{t('check_list_info')}</p>
                    <a
                      href={JEDINSTVEN_BIRACKI_SPISAK_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent-two underline-offset-2 hover:underline"
                    >
                      {t('check_list_link')}
                    </a>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      id="generateVoter"
                      type="checkbox"
                      checked={updateVoter}
                      onChange={() => setUpdateVoter(!updateVoter)}
                      className="h-4 w-4 rounded border-[color:var(--theme-color-200)] text-[color:var(--theme-accent)] focus:ring-[color:var(--theme-accent)]"
                    />
                    <label
                      htmlFor="generateVoter"
                      className="cursor-pointer text-sm text-[color:var(--theme-color-700)]"
                    >
                      {t('generate_request_for_list')}
                    </label>
                  </div>
                </>
              )}
              {activeTab === 'personal-data' && (
                <>
                  <InputTextField
                    field_name="full_name"
                    data={data}
                    handleChange={handleChange}
                    handleFieldError={handleFieldError}
                  />
                  <InputTextField
                    field_name="parent_name"
                    data={data}
                    handleChange={handleChange}
                    handleFieldError={handleFieldError}
                  />
                  <InputNumberField
                    field_name="jmbg"
                    data={data}
                    handleChange={handleChange}
                    handleFieldError={handleFieldError}
                    min={13}
                    max={13}
                  />
                  <InputTextField
                    field_name="address"
                    data={data}
                    handleChange={handleChange}
                    handleFieldError={handleFieldError}
                  />
                  <InputTextField
                    field_name="address_abroad"
                    data={data}
                    handleChange={handleChange}
                    handleFieldError={handleFieldError}
                  />
                  <CountryField
                    availableCountries={availableCountries}
                    availableCities={availableCities}
                    data={data}
                    handleChange={handleChange}
                    handleFieldError={handleFieldError}
                  />
                  <InputTelField
                    field_name="telephone"
                    placeholder="+381691234567"
                    data={data}
                    handleChange={handleChange}
                    handleFieldError={handleFieldError}
                  />
                  <InputEmailField
                    field_name="email"
                    placeholder="marko.markovic@gmail.com"
                    data={data}
                    handleChange={handleChange}
                    handleFieldError={handleFieldError}
                  />
                  {/* Personal Data Tab Pagination */}
                  <PaginationButtonsPersonalData
                    tabs={tabs}
                    currentTabIndex={currentTabIndex}
                    goToPreviousTab={goToPreviousTab}
                    goToNextTab={goToNextTab}
                  />
                  <PaginationArrowsPersonalData
                    tabs={tabs}
                    currentTabIndex={currentTabIndex}
                    goToPreviousTab={goToPreviousTab}
                    goToNextTab={goToNextTab}
                  />
                </>
              )}
              {activeTab === 'signature' && (
                <Signature
                  data={data}
                  setData={setData}
                  handleFieldError={handleFieldError}
                />
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default VotingForm
