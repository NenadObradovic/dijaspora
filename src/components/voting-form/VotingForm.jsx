import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateForm } from '../../utils/validateForm.js'
import { buildEmbassyOptions } from '../../utils/buildEmbassyOptions.js'
import { useEmbassyData } from '../../hooks/useEmbassyData.js'
import { useFormTabs } from '../../hooks/useFormTabs.js'

import VotingFormIntro from './VotingFormIntro.jsx'
import EmbassyInfo from './parts/EmbassyInfo.jsx'
import UserInfo from './parts/UserInfo.jsx'
import PaginationButtons from './pagination/PaginationButtons.jsx'
import PaginationArrows from './pagination/PaginationArrows.jsx'
import Signature from './parts/Signature.jsx'
import InputTextField from './parts/InputTextField.jsx'
import InputNumberField from './parts/InputNumberField.jsx'
import InputTelField from './parts/InputTelField.jsx'
import InputEmailField from './parts/InputEmailField.jsx'
import CountryField from './parts/CountryField.jsx'
import GenerateRequestField from './parts/GenerateRequestField.jsx'

const VotingForm = ({ onSubmit, docGenerated, isGenerating }) => {
  const { t, i18n } = useTranslation()
  const [isMobile, setIsMobile] = useState(false)
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

  const { embassyData, embassyCyrlData, availableCountries, embassyByCountry } =
    useEmbassyData(i18n.language)

  const {
    tabs,
    activeTab,
    setActiveTab,
    currentTabIndex,
    errors,
    setErrors,
    goToNextTab,
    goToPreviousTab,
  } = useFormTabs(data, t)

  const [availableEmbassy, setAvailableEmbassy] = useState()

  const handleChange = (e) => {
    const { name, value } = e.target
    setData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === 'country' ? { embassy: '', city: '' } : {}),
    }))

    if (name === 'country') {
      setAvailableEmbassy(buildEmbassyOptions(value, embassyByCountry))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const formErrors = validateForm(data, 'all', t)
    setErrors(formErrors)

    const nonSignatureErrors = Object.keys(formErrors).filter(
      (k) => k !== 'signature',
    )
    if (nonSignatureErrors.length > 0) {
      setActiveTab('personal-data')
    }

    if (Object.keys(formErrors).length === 0) {
      let formData = { ...data }

      let realCountryValue = availableCountries[formData.country] ?? ''
      if ('sr' === i18n.language) {
        realCountryValue =
          embassyCyrlData?.availableCountries?.[formData.country] ??
          realCountryValue
      }

      if (formData.embassy) {
        let embassyCountry = embassyByCountry[formData.country]
        if ('sr' === i18n.language) {
          embassyCountry =
            embassyCyrlData?.embassyByCountry?.[formData.country] ??
            embassyCountry
        }

        formData.embassy_email = embassyCountry.email ?? []

        let realCityValue
        if ('default' === formData.embassy) {
          realCityValue = embassyCountry.embassy ?? ''
        } else if (embassyCountry?.honorary_consulate?.[formData.embassy]) {
          realCityValue =
            embassyCountry.honorary_consulate[formData.embassy].embassy ?? ''
          if (embassyCountry.honorary_consulate[formData.embassy].email) {
            formData.embassy_email = formData.embassy_email.concat(
              embassyCountry.honorary_consulate[formData.embassy].email,
            )
          }
        } else {
          realCityValue =
            embassyCountry.consulate[formData.embassy].embassy ?? ''
          if (embassyCountry.consulate[formData.embassy].email) {
            formData.embassy_email = formData.embassy_email.concat(
              embassyCountry.consulate[formData.embassy].email,
            )
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
    <div className="relative flex w-full flex-col gap-6">
      {!docGenerated && (
        <>
          {activeTab === 'check' && <VotingFormIntro />}
          {activeTab === 'signature' && (
            <>
              <EmbassyInfo
                embassyData={embassyData}
                countryKey={data.country}
                embassyKey={data.embassy}
              />
              <UserInfo data={data} />
            </>
          )}
          <div className="flex w-full max-w-screen-lg flex-col gap-8 pt-4 sm:grid sm:grid-cols-[250px_1fr]">
            <div>
              <div className="sticky top-[40px] flex flex-wrap justify-between gap-y-8 sm:flex-col sm:justify-start">
                <div className="flex shrink-0 flex-col gap-y-4 sm:w-full sm:flex-col">
                  {tabs.map((tab, index) => {
                    if (isMobile && tab !== activeTab) {
                      return null
                    }

                    return (
                      <div key={index} className="relative flex items-center">
                        <div
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-sm font-medium ${index === currentTabIndex ? 'bg-accent-two text-white' : 'bg-gray-300 text-gray-700'}`}
                        >
                          {index + 1}
                        </div>
                        <p
                          className={`m-0 cursor-default rounded-t-md px-2 py-1 text-sm font-medium ${
                            activeTab === tab
                              ? 'text-[color:var(--theme-color-800)]'
                              : 'hidden text-[color:var(--theme-color-500)] sm:inline-block'
                          }`}
                        >
                          {t(tab.replace('-', '_') + '_tab')}
                        </p>
                      </div>
                    )
                  })}
                </div>
                {updateVoter !== null && (
                  <PaginationButtons
                    tabs={tabs}
                    currentTabIndex={currentTabIndex}
                    goToPreviousTab={goToPreviousTab}
                    goToNextTab={goToNextTab}
                  />
                )}
              </div>
            </div>
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
                      maxLength={13}
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
                  </>
                )}
                {activeTab === 'signature' && (
                  <Signature
                    data={data}
                    setData={setData}
                    handleFieldError={handleFieldError}
                    isGenerating={isGenerating}
                  />
                )}
              </form>
              {updateVoter !== null && (
                <PaginationArrows
                  tabs={tabs}
                  currentTabIndex={currentTabIndex}
                  goToPreviousTab={goToPreviousTab}
                  goToNextTab={goToNextTab}
                />
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default VotingForm
