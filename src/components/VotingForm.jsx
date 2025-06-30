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
    const emails = Array.isArray(source.email) ? source.email : [source.email]
    const phones = Array.isArray(source.telephone)
      ? source.telephone
      : [source.telephone]
    const gmap = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      address,
    )}`

    return (
      <div className="mb-6 rounded-lg border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] p-4 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-[color:var(--theme-color-800)]">
          {countryData.country}
          {!isDefault && source.city ? ` – ${source.city}` : ''}
        </h2>

        <p className="text-sm text-[color:var(--theme-color-700)]">
          <span className="font-medium">{t('address_info_title')}:</span>{' '}
          {address}
        </p>

        {emails.length > 0 && (
          <p className="text-sm text-[color:var(--theme-color-700)]">
            <span className="font-medium">{t('email_info_title')}:</span>{' '}
            {emails.map((email, idx) => (
              <a
                key={idx}
                href={`mailto:${email}`}
                className="text-accent-one hover:underline"
              >
                {email}
                {idx < emails.length - 1 ? ', ' : ''}
              </a>
            ))}
          </p>
        )}

        {phones.length > 0 && (
          <p className="text-sm text-[color:var(--theme-color-700)]">
            <span className="font-medium">{t('phone_info_title')}:</span>{' '}
            {phones.map((phone, idx) => (
              <a
                key={idx}
                href={`tel:${phone.replace(/[^+\d]/g, '')}`}
                className="text-accent-one hover:underline"
              >
                {phone}
                {idx < phones.length - 1 ? ', ' : ''}
              </a>
            ))}
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
    <div className="relative w-full">
      {renderEmbassyInfo()}
      <div className="flex w-full max-w-screen-lg flex-col gap-8 py-6 sm:grid sm:grid-cols-[250px_1fr]">
        <div className="flex flex-col gap-y-8">
          {/* Tab Navigation */}
          <div className="flex flex-col gap-y-4">
            {tabs.map((tab, index) => (
              <div key={index} className="relative flex items-center">
                {/* Number Circle */}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-lg font-medium ${
                    index === currentTabIndex
                      ? 'bg-red-600 text-white'
                      : index < currentTabIndex
                        ? 'bg-black text-white'
                        : 'bg-white text-black'
                  } // Next tab cursor-pointer border border-gray-300`}
                >
                  {index + 1}
                </div>
                <button
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-t-md px-4 py-2 text-sm font-medium ${
                    activeTab === tab
                      ? 'text-[color:var(--theme-color-800)]'
                      : 'text-[color:var(--theme-color-500)] hover:text-[color:var(--theme-color-700)]'
                  }`}
                >
                  {t(tab.replace('-', '_') + '_tab')}
                </button>
              </div>
            ))}
          </div>
          {/* Tab Pagination */}
          <div className="flex flex-col gap-y-4">
            {currentTabIndex > 0 && (
              <button
                type="button"
                onClick={goToPreviousTab}
                className="rounded-lg bg-accent-one px-4 py-2 font-semibold text-white shadow-md transition duration-200 hover:bg-accent-one/90"
              >
                {t('previous_step')}
              </button>
            )}
            {currentTabIndex < tabs.length - 1 && (
              <button
                type="button"
                onClick={goToNextTab}
                className="rounded-lg border border-accent-one px-4 py-2 font-semibold text-accent-one transition duration-200 hover:bg-accent-one hover:text-white"
              >
                {t('next_step')}
              </button>
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
                    className="w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-2 text-[color:var(--theme-color-800)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
                    style={{
                      color: data.country
                        ? 'var(--theme-color-800)'
                        : 'var(--theme-color-400)',
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
                        className="w-full rounded-md border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] px-4 py-2 text-[color:var(--theme-color-800)] focus:outline-none focus:ring-2 focus:ring-[color:var(--theme-accent)]"
                        style={{
                          color: data.city
                            ? 'var(--theme-color-800)'
                            : 'var(--theme-color-400)',
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
                  <div className="overflow-hidden rounded-md border border-[color:var(--theme-color-150)] bg-white shadow-sm">
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
                  <div className="mt-4 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={clearSignature}
                      className="text-sm font-medium text-[color:var(--theme-accent)] underline underline-offset-2 transition-colors duration-150 hover:text-[color:var(--theme-color-700)]"
                    >
                      {t('clear_signature')}
                    </button>

                    {data.signature && (
                      <button
                        type="submit"
                        className="rounded-lg bg-accent-one px-6 py-3 font-semibold text-white shadow-md transition duration-200 hover:bg-accent-one/90"
                      >
                        {t('generate_request')}
                      </button>
                    )}
                  </div>
                  {handleFieldError('signature')}
                </div>
              </>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}

export default VotingForm
