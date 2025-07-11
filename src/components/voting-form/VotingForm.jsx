import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateForm } from '../../utils/validateForm.js'

import VotingFormIntro from './VotingFormIntro.jsx'
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
import GenerateRequestField from './parts/GenerateRequestField.jsx'

const VotingForm = ({ onSubmit, docGenerated }) => {
  const { t, i18n } = useTranslation()
  const [isMobile, setIsMobile] = useState(false)
  const [errors, setErrors] = useState({})
  const [updateVoter, setUpdateVoter] = useState(null)

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
    embassy: '',
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

  const [availableEmbassy, setAvailableEmbassy] = useState()
  const availableCountries = embassyData?.availableCountries || {}
  const embassyByCountry = embassyData?.embassyByCountry || {}

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
      ...(name === 'country' ? { embassy: '', city: '' } : {}),
    }))

    if (name === 'country') {
      if (!embassyByCountry[value]) {
        setAvailableEmbassy([])
        return
      }

      const embassyOptions = []

      embassyOptions.push({
        value: 'default',
        label: embassyByCountry[value].address,
      })

      if (embassyByCountry[value].consulate) {
        Object.entries(embassyByCountry[value].consulate).forEach(
          ([slug, consulate]) => {
            embassyOptions.push({
              value: slug,
              label: consulate.address,
            })
          },
        )
      }

      setAvailableEmbassy(embassyOptions)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const formErrors = validateForm(data, t)

    setErrors(formErrors)

    let handleErrorsActiveTab = { ...formErrors }
    delete handleErrorsActiveTab.signature

    if (Object.keys(handleErrorsActiveTab).length > 0) {
      setActiveTab('personal-data')
    }

    if (Object.keys(formErrors).length === 0) {
      let formData = { ...data }

      // Get real country and embassy names for DOC fields
      let realCountryValue = availableCountries[formData.country] ?? ''

      if (formData.embassy) {
        formData.embassy_email = embassyByCountry[formData.country].email ?? []

        let realCityValue
        if ('default' === formData.embassy) {
          realCityValue = embassyByCountry[formData.country].embassy ?? ''
        } else {
          realCityValue =
            embassyByCountry[formData.country].consulate[formData.embassy]
              .embassy ?? ''

          if (
            embassyByCountry[formData.country].consulate[formData.embassy].email
          ) {
            formData.embassy_email =
              embassyByCountry[formData.country].consulate[
                formData.embassy
              ].email
          }
        }
        formData.embassy = realCityValue
      }

      formData.country = realCountryValue

      if (!formData.city) {
        formData.city = formData.embassy
      }

      onSubmit(formData, updateVoter)
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
      {!docGenerated && activeTab === 'check' && <VotingFormIntro />}
      {activeTab !== 'check' && (
        <EmbassyInfo
          embassyData={embassyData}
          countryKey={data.country}
          embassyKey={data.embassy}
        />
      )}
      {!docGenerated && (
        <>
          <div className="flex w-full max-w-screen-lg flex-col gap-8 pt-4 sm:grid sm:grid-cols-[250px_1fr]">
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
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium ${index === currentTabIndex ? 'bg-accent-two text-white' : 'bg-gray-300 text-gray-700'}`}
                      >
                        {index + 1}
                      </div>
                      <button
                        onClick={() => updateVoter && setActiveTab(tab)}
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
              {updateVoter !== null && (
                <>
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
                </>
              )}
            </div>
            {/* Tab Content */}
            <div>
              <form
                onSubmit={handleSubmit}
                className="space-y-6 text-[color:var(--theme-color-700)]"
              >
                {activeTab === 'check' && (
                  <GenerateRequestField
                    updateVoter={updateVoter}
                    setUpdateVoter={setUpdateVoter}
                  />
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
                      availableEmbassy={availableEmbassy}
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
        </>
      )}
    </div>
  )
}

export default VotingForm
