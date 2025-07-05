import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SignatureCanvas from 'react-signature-canvas'
import { JEDINSTVEN_BIRACKI_SPISAK_URL } from '../constants/global.js'
import { validateForm } from '../utils/validateForm.js'

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

  const sigCanvasRef = useRef({})

  const clearSignature = () => {
    sigCanvasRef.current.clear()
    setData((prev) => ({ ...prev, signature: '' }))
  }

  const saveSignature = () => {
    if (!sigCanvasRef.current.isEmpty()) {
      const base64 = sigCanvasRef.current
        .getTrimmedCanvas()
        .toDataURL('image/png')
      setData((prev) => ({ ...prev, signature: base64 }))
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

  const handleFieldError = (field) => {
    return errors[field] ? (
      <div className="error text-sm text-red-500">{errors[field]}</div>
    ) : null
  }

  const renderEmbassyInfo = () => {
    const countryKey = data.country
    const cityKey = data.city
    const countryData = embassyData?.citiesByCountry?.[countryKey]

    if (!countryData || !data.city) return null

    const isDefault = !cityKey || cityKey === 'default'
    const source = isDefault ? countryData : countryData.consulate?.[cityKey]

    if (!source) return null

    const address = source.address || ''
    const emails = Array.isArray(source.email)
      ? source.email
      : typeof source.email !== 'undefined' && [source.email]
    const phones = Array.isArray(source.telephone)
      ? source.telephone
      : typeof source.telephone !== 'undefined' && [source.telephone]
    const gmap = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address,
    )}`

    return (
      <div className="rounded-lg border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] p-4 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-[color:var(--theme-color-800)]">
          {countryData.country}
          {!isDefault && source.city ? ` – ${source.city}` : ''}
        </h2>

        <p className="text-sm text-[color:var(--theme-color-700)]">
          <span className="font-medium">{t('address_info_title')}:</span>{' '}
          {address}
        </p>

        {emails && emails.length > 0 && (
          <p className="text-sm text-[color:var(--theme-color-700)]">
            <span className="font-medium">{t('email_info_title')}:</span>{' '}
            {emails.map(
              (email, idx) =>
                email && (
                  <a
                    key={idx}
                    href={`mailto:${email}`}
                    className="text-accent-one hover:underline"
                  >
                    {email}
                    {idx < emails.length - 1 ? ', ' : ''}
                  </a>
                ),
            )}
          </p>
        )}

        {phones && phones.length > 0 && (
          <p className="text-sm text-[color:var(--theme-color-700)]">
            <span className="font-medium">{t('phone_info_title')}:</span>{' '}
            {phones.map(
              (phone, idx) =>
                phone && (
                  <a
                    key={idx}
                    href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                    className="text-accent-one hover:underline"
                  >
                    {phone}
                    {idx < phones.length - 1 ? ', ' : ''}
                  </a>
                ),
            )}
          </p>
        )}

        {address && (
          <a
            href={gmap}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block rounded-md bg-accent-one px-4 py-2 text-sm font-medium text-white hover:bg-accent-one/90"
          >
            {t('google_maps_info_title')}
          </a>
        )}
      </div>
    )
  }

  return (
    <div className="relative flex w-full flex-col-reverse gap-6 sm:flex-col">
      {renderEmbassyInfo()}
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
            {/* Tab Pagination - Buttons */}
            <div className="flex items-center justify-between gap-y-4 sm:w-full sm:flex-col">
              {currentTabIndex > 0 && (
                <button
                  type="button"
                  onClick={goToPreviousTab}
                  className="hidden w-full rounded-lg border border-accent-one px-4 py-2 text-sm font-semibold text-accent-one transition duration-200 hover:bg-accent-one hover:text-white sm:inline-block"
                >
                  {t('previous_step')}
                </button>
              )}
              {currentTabIndex < tabs.length - 1 && (
                <button
                  type="button"
                  onClick={goToNextTab}
                  className="hidden w-full rounded-lg bg-accent-one px-4 py-2 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-accent-one/90 sm:inline-block"
                >
                  {t('next_step')}
                </button>
              )}
              {/* Tab Pagination - Count */}
              <span className="relative flex w-full items-center justify-end gap-6 text-sm font-semibold text-[color:var(--theme-color-700)] sm:hidden">
                {t('step_label')} {currentTabIndex + 1} {t('step_of')}{' '}
                {tabs.length}
              </span>
            </div>
            {/* Tab Pagination - Arrows */}
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
                  <div>
                    <input
                      type="text"
                      name="full_name"
                      placeholder={t('full_name')}
                      value={data.full_name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-3 text-sm text-[color:var(--theme-color-800)] placeholder-[color:var(--theme-color-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
                    />
                    <span className="text-sm text-[color:var(--theme-color-400)]">
                      {t('full_name_description')}
                    </span>
                  </div>
                  <div>
                    <input
                      type="text"
                      name="parent_name"
                      placeholder={t('parent_name')}
                      value={data.parent_name}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-3 text-sm text-[color:var(--theme-color-800)] placeholder-[color:var(--theme-color-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
                    />
                    <span className="text-sm text-[color:var(--theme-color-400)]">
                      {t('parent_name_description')}
                    </span>
                    {handleFieldError('parent_name')}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="jmbg"
                      placeholder={t('jmbg')}
                      value={data.jmbg}
                      onChange={handleChange}
                      min={13}
                      max={13}
                      required
                      className="w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-3 text-sm text-[color:var(--theme-color-800)] placeholder-[color:var(--theme-color-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
                    />
                    <span className="text-sm text-[color:var(--theme-color-400)]">
                      {t('jmbg_description')}
                    </span>
                    {handleFieldError('jmbg')}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="address"
                      placeholder={t('address')}
                      value={data.address}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-3 text-sm text-[color:var(--theme-color-800)] placeholder-[color:var(--theme-color-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
                    />
                    <span className="text-sm text-[color:var(--theme-color-400)]">
                      {t('address_description')}
                    </span>
                    {handleFieldError('address')}
                  </div>
                  <div>
                    <input
                      type="text"
                      name="address_abroad"
                      placeholder={t('address_abroad')}
                      value={data.address_abroad}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-3 text-sm text-[color:var(--theme-color-800)] placeholder-[color:var(--theme-color-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
                    />
                    <span className="text-sm text-[color:var(--theme-color-400)]">
                      {t('address_abroad_description')}
                    </span>
                    {handleFieldError('address_abroad')}
                  </div>
                  <div>
                    <select
                      name="country"
                      value={data.country}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-3 text-sm text-[color:var(--theme-color-800)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
                      style={{
                        color: data.country
                          ? 'var(--theme-color-800)'
                          : 'var(--theme-color-500)',
                      }}
                    >
                      <option value="">{t('country')}</option>
                      {Object.entries(availableCountries).map(
                        ([slug, countryName]) => (
                          <option key={slug} value={slug}>
                            {countryName}
                          </option>
                        ),
                      )}
                    </select>
                    <span className="text-sm text-[color:var(--theme-color-400)]">
                      {t('country_description')}
                    </span>
                    {handleFieldError('country')}
                  </div>
                  {data.country && availableCities && (
                    <>
                      <div>
                        <select
                          name="city"
                          value={data.city}
                          onChange={handleChange}
                          required
                          className="w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-3 text-sm text-[color:var(--theme-color-800)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
                          style={{
                            color: data.city
                              ? 'var(--theme-color-800)'
                              : 'var(--theme-color-500)',
                          }}
                        >
                          <option value="">{t('city')}</option>
                          {availableCities.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                        <span className="text-sm text-[color:var(--theme-color-400)]">
                          {t('city_description')}
                        </span>
                        {handleFieldError('city')}
                      </div>
                    </>
                  )}
                  <div>
                    <input
                      type="tel"
                      name="telephone"
                      placeholder="+381691234567"
                      value={data.telephone}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-3 text-sm text-[color:var(--theme-color-800)] placeholder-[color:var(--theme-color-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
                    />
                    <span className="text-sm text-[color:var(--theme-color-400)]">
                      {t('phone_description')}
                    </span>
                    {handleFieldError('telephone')}
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="marko.markovic@gmail.com"
                      value={data.email}
                      onChange={handleChange}
                      required
                      className="w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-3 text-sm text-[color:var(--theme-color-800)] placeholder-[color:var(--theme-color-500)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
                    />
                    <span className="text-sm text-[color:var(--theme-color-400)]">
                      {t('email_description')}
                    </span>
                    {handleFieldError('email')}
                  </div>
                  {/* Tab Pagination - Buttons */}
                  <div className="hidden items-center justify-between gap-x-6 sm:flex sm:w-full">
                    {currentTabIndex > 0 && (
                      <button
                        type="button"
                        onClick={goToPreviousTab}
                        className="w-full rounded-lg border border-accent-one px-4 py-2 text-sm font-semibold text-accent-one transition duration-200 hover:bg-accent-one hover:text-white"
                      >
                        {t('previous_step')}
                      </button>
                    )}
                    {currentTabIndex < tabs.length - 1 && (
                      <button
                        type="button"
                        onClick={goToNextTab}
                        className="w-full rounded-lg bg-accent-one px-4 py-2 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-accent-one/90"
                      >
                        {t('next_step')}
                      </button>
                    )}
                  </div>
                </>
              )}
              {activeTab === 'signature' && (
                <>
                  <div className="relative">
                    <label className="mb-2 block text-sm font-medium text-[color:var(--theme-color-700)]">
                      {t('signature')}
                    </label>
                    <div className="overflow-hidden rounded-md border border-[color:var(--theme-color-150)] bg-white shadow-sm">
                      <SignatureCanvas
                        canvasProps={{
                          width: 400,
                          height: 150,
                          className: 'sigCanvas max-w-full',
                        }}
                        ref={sigCanvasRef}
                        onEnd={saveSignature}
                      />
                    </div>
                    {data.signature && (
                      <div className="mt-4 flex items-center justify-between">
                        <button
                          type="button"
                          onClick={clearSignature}
                          className="text-sm font-medium text-[color:var(--theme-accent)] underline underline-offset-2 transition-colors duration-150 hover:text-[color:var(--theme-color-700)]"
                        >
                          {t('clear_signature')}
                        </button>
                        <button
                          type="submit"
                          className="rounded-lg bg-accent-one px-6 py-3 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-accent-one/90"
                        >
                          {t('generate_request')}
                        </button>
                      </div>
                    )}
                    {handleFieldError('signature')}
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default VotingForm
