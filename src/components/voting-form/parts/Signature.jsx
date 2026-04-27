import React, { useEffect, useRef } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { useTranslation } from 'react-i18next'

const Signature = ({ data, setData, handleFieldError, isGenerating }) => {
  const { t } = useTranslation()
  const sigCanvasRef = useRef({})
  const wrapperRef = useRef(null)
  const [canvasSize, setCanvasSize] = React.useState({
    width: 580,
    height: 240,
  })

  useEffect(() => {
    const updateCanvasSize = () => {
      if (wrapperRef.current) {
        const width = wrapperRef.current.offsetWidth
        const height = Math.min(300, Math.max(180, width * 0.65))
        setCanvasSize({ width, height })
      }
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)

    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  const clearSignature = () => {
    sigCanvasRef.current.clear()
    setData((prev) => ({ ...prev, signature: '' }))
  }

  const saveSignature = () => {
    if (!sigCanvasRef.current.isEmpty()) {
      const canvas = sigCanvasRef.current.getTrimmedCanvas()
      const base64 = canvas.toDataURL('image/png')
      setData((prev) => ({ ...prev, signature: base64 }))
    }
  }

  return (
    <div className="relative">
      <label className="title mb-2 flex items-center gap-x-2 text-accent-two">
        <svg
          clipRule="evenodd"
          fillRule="evenodd"
          strokeLinejoin="round"
          strokeMiterlimit="2"
          viewBox="0 0 24 24"
          width="22"
          height="22"
          xmlns="http://www.w3.org/2000/svg"
          className="relative top-[1px] block fill-current"
        >
          <path d="m19 20.25c0-.402-.356-.75-.75-.75-2.561 0-11.939 0-14.5 0-.394 0-.75.348-.75.75s.356.75.75.75h14.5c.394 0 .75-.348.75-.75zm-7.403-3.398 9.124-9.125c.171-.171.279-.423.279-.684 0-.229-.083-.466-.28-.662l-3.115-3.104c-.185-.185-.429-.277-.672-.277s-.486.092-.672.277l-9.143 9.103c-.569 1.763-1.555 4.823-1.626 5.081-.02.075-.029.15-.029.224 0 .461.349.848.765.848.511 0 .991-.189 5.369-1.681zm-3.27-3.342 2.137 2.137-3.168 1.046zm.955-1.166 7.651-7.616 2.335 2.327-7.637 7.638z" />
        </svg>
        {t('signature')}
      </label>
      <div
        ref={wrapperRef}
        className="voting-form-field overflow-hidden rounded-md border border-[color:var(--theme-color-150)] bg-white shadow-sm"
      >
        <SignatureCanvas
          canvasProps={{
            width: canvasSize.width,
            height: canvasSize.height,
            className:
              'sigCanvas max-w-full w-full h-full touch-none cursor-crosshair',
          }}
          ref={sigCanvasRef}
          onEnd={saveSignature}
        />
      </div>
      {handleFieldError('signature')}
      {data.signature && (
        <p className="mt-2 text-sm font-medium text-green-600">
          ✓ {t('signature_saved')}
        </p>
      )}
      {data.signature && (
        <div className="mt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={clearSignature}
            disabled={isGenerating}
            className="text-sm font-medium text-[color:var(--theme-accent)] underline underline-offset-2 transition-colors duration-150 hover:text-[color:var(--theme-color-700)] disabled:opacity-50"
          >
            {t('clear_signature')}
          </button>
          <button
            type="submit"
            disabled={isGenerating}
            className="rounded-lg bg-accent-two px-6 py-3 text-sm font-semibold text-white shadow-md transition duration-200 hover:bg-accent-two/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {t('generate_request')}
          </button>
        </div>
      )}
    </div>
  )
}

export default Signature
