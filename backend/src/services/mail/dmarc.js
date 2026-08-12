import dns from 'node:dns/promises'

export async function run(target) {
  const name = `_dmarc.${target}`
  const records = await dns.resolveTxt(name).catch(() => [])
  const record = records.map((parts) => parts.join('')).find((value) => value.startsWith('v=DMARC1')) || null
  if (!record) return { exists: false, name, record: null, tags: {}, policy: null, valid: false }
  const tags = Object.fromEntries(record.split(';').map((part) => part.trim()).filter(Boolean).map((part) => {
    const index = part.indexOf('=')
    return [part.slice(0, index).trim(), part.slice(index + 1).trim()]
  }))
  return { exists: true, name, record, tags, policy: tags.p || 'none', subdomainPolicy: tags.sp || tags.p || 'none', pct: Number(tags.pct || 100), rua: tags.rua || null, ruf: tags.ruf || null, valid: Boolean(tags.p) }
}
