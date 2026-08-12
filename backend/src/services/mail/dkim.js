import dns from 'node:dns/promises'
import { AppError } from '../../utils/errors.js'

const COMMON_SELECTORS = [
  'default', 'google', 'k1', 'mail', 'selector1', 'selector2', 's1', 's2', 'dkim',
  'mandrill', 'sendgrid', 'sendgrid2', 'smtp', 'pic', 'hubspot', 'mailchimp', 'm1', 'm2'
]

const SELECTOR_PATTERN = /^[a-zA-Z0-9_-]{1,63}$/

async function queryDkim(target, selector) {
  const name = `${selector}._domainkey.${target}`
  const records = await dns.resolveTxt(name).catch(() => [])
  const record = records.map((parts) => parts.join('')).find((value) => value.includes('v=DKIM1')) || null
  if (!record) return { exists: false, selector, name, record: null, tags: {}, valid: false }

  const tags = {}
  record.split(';').forEach((item) => {
    const part = item.trim()
    if (!part) return
    const index = part.indexOf('=')
    if (index > -1) {
      tags[part.slice(0, index).trim()] = part.slice(index + 1).trim()
    }
  })

  return {
    exists: true,
    selector,
    name,
    record,
    tags,
    keyType: tags.k || 'rsa',
    publicKey: tags.p || null,
    valid: Boolean(tags.p)
  }
}

export async function run(target, options = {}) {
  const rawSelector = typeof options.selector === 'string' ? options.selector.trim() : ''

  if (rawSelector) {
    if (!SELECTOR_PATTERN.test(rawSelector)) {
      throw new AppError('Selector DKIM tidak valid. Gunakan huruf, angka, strip, atau underscore (1-63 karakter).', 'INVALID_SELECTOR', 400)
    }
    const result = await queryDkim(target, rawSelector)
    return {
      autoDetected: false,
      selector: rawSelector,
      found: result.exists,
      data: result,
      searched: [rawSelector]
    }
  }

  // Auto-detection with bounded concurrency (3 at a time)
  const results = []
  for (let i = 0; i < COMMON_SELECTORS.length; i += 3) {
    const chunk = COMMON_SELECTORS.slice(i, i + 3)
    const chunkResults = await Promise.all(chunk.map(sel => queryDkim(target, sel)))
    results.push(...chunkResults)
    // Stop early if we find a working one?
    // User asked to use common selectors, usually we want to see if multiple exist.
  }

  const found = results.filter(r => r.exists)

  return {
    autoDetected: true,
    found: found.length > 0,
    count: found.length,
    primary: found[0] || results[0], // fallback to first checked if none found
    allFound: found,
    searched: COMMON_SELECTORS
  }
}
