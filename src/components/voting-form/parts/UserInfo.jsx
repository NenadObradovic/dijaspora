import React from 'react'
import { useTranslation } from 'react-i18next'

const UserInfo = ({ data }) => {
  const { t } = useTranslation()

  if (!data) return null

  return (
    <div className="rounded-lg border border-[color:var(--theme-color-150)] bg-[color:var(--theme-special-lightest)] p-4 shadow-sm">
      <h2 className="title mb-2 text-xl text-accent-two">{data.full_name}</h2>

      <p className="text-sm text-[color:var(--theme-color-700)]">
        <span className="font-medium">{t('parent_name')}</span>:{' '}
        {data?.parent_name ?? '/'}
      </p>

      <p className="text-sm text-[color:var(--theme-color-700)]">
        <span className="font-medium">{t('jmbg')}</span>: {data?.jmbg ?? '/'}
      </p>

      <p className="text-sm text-[color:var(--theme-color-700)]">
        <span className="font-medium">{t('address')}</span>:{' '}
        {data?.address ?? '/'}
      </p>

      <p className="text-sm text-[color:var(--theme-color-700)]">
        <span className="font-medium">{t('address_abroad')}</span>:{' '}
        {data?.address_abroad ?? '/'}
      </p>

      <p className="text-sm text-[color:var(--theme-color-700)]">
        <span className="font-medium">{t('phone_info_title')}</span>{' '}
        {data?.telephone ?? '/'}
      </p>

      <p className="text-sm text-[color:var(--theme-color-700)]">
        <span className="font-medium">{t('email_info_title')}</span>{' '}
        {data?.email ?? '/'}
      </p>
    </div>
  )
}

export default UserInfo
