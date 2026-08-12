import dns from 'node:dns/promises'

export async function run(target) {
  const records = await dns.resolveTxt(target).catch(() => [])
  const record = records.map((parts) => parts.join('')).find((value) => value.startsWith('v=spf1')) || null
  if (!record) return { exists: false, record: null, mechanisms: [], dnsLookupEstimate: 0, valid: false }
  const mechanisms = record.split(/\s+/).slice(1).filter(Boolean)
  const dnsLookupEstimate = mechanisms.filter((value) => /(?:include:|\ba(?::|$)|\bmx(?::|$)|exists:|redirect=)/.test(value)).length
  return { exists: true, record, mechanisms, dnsLookupEstimate, exceedsLookupLimit: dnsLookupEstimate > 10, valid: dnsLookupEstimate <= 10 }
}
