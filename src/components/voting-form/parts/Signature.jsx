import React, { useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { useTranslation } from 'react-i18next'

const Signature = ({ data, setData, handleFieldError }) => {
  const { t } = useTranslation()
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

  return (
    <div className="relative">
      <label className="mb-2 block text-sm font-medium text-[color:var(--theme-color-700)]">
        {t('signature')}
      </label>
      <div className="voting-form-field overflow-hidden rounded-md border border-[color:var(--theme-color-150)] bg-white shadow-sm">
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
      {handleFieldError('signature', false)}
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
    </div>
  )
}

export default Signature
