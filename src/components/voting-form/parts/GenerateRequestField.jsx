import React from 'react'
import { useTranslation } from 'react-i18next'
import { JEDINSTVEN_BIRACKI_SPISAK_URL } from '../../../constants/global.js'

const GenerateRequestField = ({ updateVoter, setUpdateVoter }) => {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-2">
      <div>
        <h4 className="text-accent-three title mb-6">{t('check_list_info')}</h4>
        <a
          href={JEDINSTVEN_BIRACKI_SPISAK_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full rounded-lg bg-accent-two px-4 py-2 text-center text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-accent-two/90"
        >
          {t('check_list_link')}
        </a>
      </div>
      <h4 className="text-accent-three title mt-6">
        {t('generate_request_for_list')}
      </h4>
      <div className="mt-2 flex gap-x-6">
        <div className="flex items-center space-x-2">
          <input
            id="updateVoter-yes"
            type="radio"
            name="updateVoter"
            value="yes"
            checked={updateVoter === true}
            onChange={() => setUpdateVoter(true)}
            className="h-4 w-4 cursor-pointer text-[color:var(--theme-accent)] focus:ring-[color:var(--theme-accent)]"
          />
          <label
            htmlFor="updateVoter-yes"
            className="cursor-pointer text-sm font-medium text-[color:var(--theme-accent)]"
          >
            {t('generate_request_label_yes')}
          </label>
        </div>

        <div className="flex items-center space-x-2">
          <input
            id="updateVoter-no"
            type="radio"
            name="updateVoter"
            value="no"
            checked={updateVoter === false}
            onChange={() => setUpdateVoter(false)}
            className="h-4 w-4 cursor-pointer text-[color:var(--theme-accent)] focus:ring-[color:var(--theme-accent)]"
          />
          <label
            htmlFor="updateVoter-no"
            className="cursor-pointer text-sm font-medium text-[color:var(--theme-accent)]"
          >
            {t('generate_request_label_no')}
          </label>
        </div>
      </div>
    </div>
  )
}

export default GenerateRequestField
