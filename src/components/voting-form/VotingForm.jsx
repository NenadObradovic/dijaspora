import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { validateForm } from '../../utils/validateForm.js'

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
  }, [i18n.language])

  const [availableEmbassy, setAvailableEmbassy] = useState()
  const availableCountries =
    i18n.language === 'cyrl'
      ? embassyData?.availableCountries || {}
      : Object.fromEntries(
          Object.entries(embassyData?.availableCountries || {}).sort((a, b) =>
            a[1].localeCompare(b[1], 'en', { sensitivity: 'base' }),
          ),
        )
  const embassyByCountry = embassyData?.embassyByCountry || {}

  const [activeTab, setActiveTab] = useState('check')
  const tabs = ['check', 'personal-data', 'signature']
  const currentTabIndex = tabs.indexOf(activeTab)

  const goToNextTab = () => {
    const formErrors = validateForm(data, activeTab, t)

    setErrors(formErrors)

    if (
      Object.keys(formErrors).length === 0 &&
      currentTabIndex < tabs.length - 1
    ) {
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

      if (embassyByCountry[value].address) {
        embassyOptions.push({
          value: 'default',
          label: embassyByCountry[value].address,
        })
      }

      if (embassyByCountry[value].consulate) {
        Object.entries(embassyByCountry[value].consulate).forEach(
          ([slug, consulate]) => {
            if (consulate.address) {
              embassyOptions.push({
                value: slug,
                label: consulate.address,
              })
            }
          },
        )
      }

      if (embassyByCountry[value].honorary_consulate) {
        Object.entries(embassyByCountry[value].honorary_consulate).forEach(
          ([slug, honorary_consulate]) => {
            if (honorary_consulate.address) {
              embassyOptions.push({
                value: slug,
                label: honorary_consulate.address,
              })
            }
          },
        )
      }

      setAvailableEmbassy(embassyOptions)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const formErrors = validateForm(data, 'all', t)

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
        const embassyCountry = embassyByCountry[formData.country]

        formData.embassy_email = embassyCountry.email ?? []

        let realCityValue
        if ('default' === formData.embassy) {
          realCityValue = embassyCountry.embassy ?? ''
        } else if (embassyCountry?.honorary_consulate[formData.embassy]) {
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
              {updateVoter !== null && (
                <>
                  <PaginationArrows
                    tabs={tabs}
                    currentTabIndex={currentTabIndex}
                    goToPreviousTab={goToPreviousTab}
                    goToNextTab={goToNextTab}
                  />
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default VotingForm
