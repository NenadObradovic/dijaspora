import React, { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import SignatureCanvas from 'react-signature-canvas'
import { JEDINSTVEN_BIRACKI_SPISAK_URL } from '../constants/global.js'
import { validateForm } from '../utils/validateForm.js'

const VotingForm = ({ onSubmit }) => {
  const { t } = useTranslation()
  const [errors, setErrors] = useState({})
  const [updateVoter, setUpdateVoter] = useState(false)

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
    fetch('/data/embassy.json')
      .then((res) => res.json())
      .then((json) => setEmbassyData(json))
      .catch((err) => {
        // eslint-disable-next-line no-console
        console.error('Greška pri učitavanju JSON-a:', err)
      })
  }, [])

  const [availableCities, setAvailableCities] = useState()
  const availableCountries = embassyData?.availableCountries || []
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
      setAvailableCities(citiesByCountry[value]['address'])
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
      <div className="error" style={{ color: 'red' }}>
        {errors[field]}
      </div>
    ) : null
  }

  return (
    <div>
      <div className="mb-6 flex space-x-2 border-b border-[color:var(--theme-color-150)]">
        <button
          onClick={() => setActiveTab('check')}
          className={`rounded-t-md border-b-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'check'
              ? 'border-[color:var(--theme-accent)] text-[color:var(--theme-color-800)]'
              : 'border-transparent text-[color:var(--theme-color-500)] hover:text-[color:var(--theme-color-700)]'
          }`}
        >
          {t('check_tab')}
        </button>
        <button
          onClick={() => setActiveTab('personal-data')}
          className={`rounded-t-md border-b-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'personal-data'
              ? 'border-[color:var(--theme-accent)] text-[color:var(--theme-color-800)]'
              : 'border-transparent text-[color:var(--theme-color-500)] hover:text-[color:var(--theme-color-700)]'
          }`}
        >
          {t('personal_data_tab')}
        </button>
        <button
          onClick={() => setActiveTab('signature')}
          className={`rounded-t-md border-b-2 px-4 py-2 text-sm font-medium ${
            activeTab === 'signature'
              ? 'border-[color:var(--theme-accent)] text-[color:var(--theme-color-800)]'
              : 'border-transparent text-[color:var(--theme-color-500)] hover:text-[color:var(--theme-color-700)]'
          }`}
        >
          {t('signature_tab')}
        </button>
      </div>
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
                className="text-[color:var(--theme-link)] underline underline-offset-2 transition-colors hover:text-[color:var(--theme-accent)]"
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
                className="text-sm text-[color:var(--theme-color-700)]"
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
                className="w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-2 text-[color:var(--theme-color-800)] placeholder-[color:var(--theme-color-400)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
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
                className="w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-2 text-[color:var(--theme-color-800)] placeholder-[color:var(--theme-color-400)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
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
                className="w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-2 text-[color:var(--theme-color-800)] placeholder-[color:var(--theme-color-400)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
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
                className="w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-2 text-[color:var(--theme-color-800)] placeholder-[color:var(--theme-color-400)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
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
                className="w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-2 text-[color:var(--theme-color-800)] placeholder-[color:var(--theme-color-400)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
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
                className="w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-2 text-[color:var(--theme-color-800)] placeholder-[color:var(--theme-color-400)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
              >
                <option value="">{t('country')}</option>
                {availableCountries.map((countryName) => (
                  <option key={countryName} value={countryName}>
                    {countryName}
                  </option>
                ))}
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
                    className="w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-2 text-[color:var(--theme-color-800)] placeholder-[color:var(--theme-color-400)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
                  >
                    <option value="" disabled>
                      {t('city')}
                    </option>
                    {availableCities.map((cityName) => (
                      <option key={cityName} value={cityName}>
                        {cityName}
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
                className="w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-2 text-[color:var(--theme-color-800)] placeholder-[color:var(--theme-color-400)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
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
                className="w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-2 text-[color:var(--theme-color-800)] placeholder-[color:var(--theme-color-400)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
              />
              <span className="text-sm text-[color:var(--theme-color-400)]">
                {t('email_description')}
              </span>
              {handleFieldError('email')}
            </div>
          </>
        )}
        {activeTab === 'signature' && (
          <>
            <div className="mt-4">
              <label className="mb-2 block text-sm font-medium text-[color:var(--theme-color-700)]">
                {t('signature')}
              </label>
              <div className="inline-flex overflow-hidden rounded-lg border border-[color:var(--theme-color-150)]">
                <SignatureCanvas
                  canvasProps={{
                    width: 400,
                    height: 150,
                    className: 'sigCanvas',
                  }}
                  ref={sigCanvasRef}
                  onEnd={saveSignature}
                />
              </div>
              <button
                type="button"
                onClick={clearSignature}
                className="mt-2 text-sm text-[color:var(--theme-accent)] underline hover:text-[color:var(--theme-color-700)]"
              >
                {t('clear_signature')}
              </button>
              {handleFieldError('signature')}
            </div>
            <br />
            {data.signature && (
              <button
                type="submit"
                className="inline-flex items-center justify-center rounded-md bg-[color:var(--theme-accent)] px-6 py-2 text-white transition hover:bg-opacity-90 disabled:opacity-50"
              >
                {t('generate_request')}
              </button>
            )}
          </>
        )}
        <div className="mt-8 flex justify-between">
          {currentTabIndex > 0 && (
            <button
              type="button"
              onClick={goToPreviousTab}
              className="text-sm text-[color:var(--theme-accent)] hover:underline"
            >
              {t('previous_step')}
            </button>
          )}
          {currentTabIndex < tabs.length - 1 && (
            <button
              type="button"
              onClick={goToNextTab}
              className="text-sm text-[color:var(--theme-accent)] hover:underline"
            >
              {t('next_step')}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default VotingForm
