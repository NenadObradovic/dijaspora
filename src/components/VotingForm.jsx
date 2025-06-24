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
      <div className="tabs">
        <button
          onClick={() => setActiveTab('check')}
          className={activeTab === 'check' ? 'active' : ''}
        >
          {t('check_tab')}
        </button>
        <button
          onClick={() => setActiveTab('personal-data')}
          className={activeTab === 'personal-data' ? 'active' : ''}
        >
          {t('personal_data_tab')}
        </button>
        <button
          onClick={() => setActiveTab('signature')}
          className={activeTab === 'signature' ? 'active' : ''}
        >
          {t('signature_tab')}
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {activeTab === 'check' && (
          <>
            <div>
              <p>{t('check_list_info')}</p>
              <a href={JEDINSTVEN_BIRACKI_SPISAK_URL} target="_blank">
                {t('check_list_link')}
              </a>
            </div>
            <div>
              <label form="generateVoter">
                {t('generate_request_for_list')}
              </label>
              <input
                id="generateVoter"
                type="checkbox"
                checked={updateVoter}
                onChange={() => setUpdateVoter(!updateVoter)}
              />
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
              />
              <span>{t('full_name_description')}</span>
            </div>
            <div>
              <input
                type="text"
                name="parent_name"
                placeholder={t('parent_name')}
                value={data.parent_name}
                onChange={handleChange}
                required
              />
              <span>{t('parent_name_description')}</span>
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
              />
              <span>{t('jmbg_description')}</span>
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
              />
              <span>{t('address_description')}</span>
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
              />
              <span>{t('address_abroad_description')}</span>
              {handleFieldError('address_abroad')}
            </div>
            <div>
              <select
                name="country"
                value={data.country}
                onChange={handleChange}
                required
              >
                <option value="">{t('country')}</option>
                {availableCountries.map((countryName) => (
                  <option key={countryName} value={countryName}>
                    {countryName}
                  </option>
                ))}
              </select>
              <span>{t('country_description')}</span>
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
                  <span>{t('city_description')}</span>
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
              />
              <span>{t('phone_description')}</span>
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
              />
              <span>{t('email_description')}</span>
              {handleFieldError('email')}
            </div>
          </>
        )}
        {activeTab === 'signature' && (
          <>
            <div>
              <label>{t('signature')}</label>
              <br />
              <div style={{ border: '1px solid', display: 'inline-flex' }}>
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
              <button type="button" onClick={clearSignature}>
                {t('clear_signature')}
              </button>
              {handleFieldError('signature')}
            </div>
            <br />
            {data.signature && (
              <button type="submit">{t('generate_request')}</button>
            )}
          </>
        )}
        <div style={{ marginTop: '20px' }}>
          {currentTabIndex > 0 && (
            <button type="button" onClick={goToPreviousTab}>
              {t('previous_step')}
            </button>
          )}
          {currentTabIndex < tabs.length - 1 && (
            <button type="button" onClick={goToNextTab}>
              {t('next_step')}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default VotingForm
