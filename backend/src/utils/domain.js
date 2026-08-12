import { isIP } from 'node:net'

const label = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/

export function normalizeDomain(input) {
  const value = typeof input === 'string' ? input.trim().toLowerCase() : ''
  const domain = value.endsWith('.') ? value.slice(0, -1) : value
  const labels = domain.split('.')
  if (!value || value.length > 253 || value.includes('/') || value.includes(':') || /\s/.test(value) || isIP(value) || labels.length < 2 || labels.some((part) => !label.test(part))) return null
  return domain
}
