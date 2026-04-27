import React, { useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

const EmailTemplate = ({ updateVoter }) => {
  const { t } = useTranslation()
  const [copied, setCopied] = useState(false)
  const [copyError, setCopyError] = useState(false)
  const preRef = useRef(null)
  const email_body = updateVoter ? 'email_body_voter' : 'email_body_non_voter'
  const emailText = t(email_body)

  const fallbackCopy = (text) => {
    const el = document.createElement('textarea')
    el.value = text
    el.setAttribute('readonly', '')
    el.style.position = 'fixed'
    el.style.top = '-9999px'
    document.body.appendChild(el)
    el.select()
    const ok = document.execCommand('copy')
    document.body.removeChild(el)
    return ok
  }

  const handleCopy = async () => {
    setCopyError(false)

    let success = false

    try {
      if (navigator.clipboard?.writeText && window.isSecureContext) {
        await navigator.clipboard.writeText(emailText)
        success = true
      } else {
        success = fallbackCopy(emailText)
      }
    } catch {
      success = false
    }

    if (success) {
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } else {
      setCopyError(true)
      window.setTimeout(() => setCopyError(false), 2500)
      if (preRef.current) {
        preRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }
  }

  return (
    <div className="mt-6 w-full">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="text-accent-three title">
          {t('email_heading_example')}
        </h3>
        <button
          type="button"
          onClick={handleCopy}
          className="flex shrink-0 items-center gap-1.5 rounded-md border border-[color:var(--theme-color-300)] px-3 py-1.5 text-xs font-medium text-[color:var(--theme-color-600)] transition-colors duration-150 hover:border-accent-two hover:text-accent-two"
        >
          {copied ? (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z" />
              </svg>
              {t('copied')}
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                className="fill-current"
              >
                <path d="M15.143 13.244l.837-2.244 2.698 5.641-5.678 2.502.805-2.23c-5.234-1.959-7.496-7.378-5.564-12.515 1.355 5.551 5.362 8.458 6.902 8.846zm-4.143-10.244c3.681 0 7 2.593 7.949 6.088.851-2.597.28-5.637-1.873-7.661-2.519-2.367-6.115-2.742-9.076-1.079-2.894 1.62-4.553 4.738-4.315 7.887 1.116-3.01 4.069-5.235 7.315-5.235z" />
              </svg>
              {t('copy_email')}
            </>
          )}
        </button>
      </div>
      {copyError && (
        <div className="mb-3 text-sm text-red-500" role="status">
          {t('copy_failed', {
            defaultValue: 'Copy failed. Please select and copy manually.',
          })}
        </div>
      )}
      <pre
        ref={preRef}
        className="max-w-full overflow-x-auto whitespace-pre-wrap break-words"
      >
        {emailText}
      </pre>
    </div>
  )
}

export default EmailTemplate
