import validator from 'validator'

export function toSafeMailto(email) {
  if (typeof email !== 'string') return null
  const trimmed = email.trim()
  if (!trimmed) return null
  if (/[\r\n]/.test(trimmed)) return null
  if (!validator.isEmail(trimmed)) return null
  return `mailto:${trimmed}`
}
