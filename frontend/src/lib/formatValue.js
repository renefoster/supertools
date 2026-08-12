export function labelize(key) {
  return key.replace(/([A-Z])/g, ' $1').replaceAll('_', ' ').replace(/^./, (char) => char.toUpperCase())
}

export function valueText(value) {
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'object') return ''
  return String(value)
}
