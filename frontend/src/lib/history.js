const browserKey = 'supertools-browser-id'
const baseUrl = import.meta.env.VITE_SUPABASE_URL
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

function browserId() {
  let value = localStorage.getItem(browserKey)
  if (!value) {
    value = crypto.randomUUID()
    localStorage.setItem(browserKey, value)
  }
  return value
}

function headers(prefer = '') {
  return {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    'x-browser-id': browserId(),
    'Content-Type': 'application/json',
    Prefer: prefer
  }
}

export function historyEnabled() {
  return Boolean(baseUrl && anonKey && !baseUrl.includes('your-project'))
}

export function createSummary(data) {
  if (data.ips) return { ips: data.ips }
  if (data.status) return { status: data.status, url: data.url }
  if (data.validTo) return { issuer: data.issuer?.O || data.issuer?.CN, validTo: data.validTo, daysRemaining: data.daysRemaining }
  return { registrar: data.registrar, expires: data.expires }
}

export async function saveHistory(result) {
  if (!historyEnabled()) return
  await fetch(`${baseUrl}/rest/v1/tool_history`, {
    method: 'POST',
    headers: headers('return=minimal'),
    body: JSON.stringify({
      browser_id: browserId(), tool: result.tool, target: result.target,
      success: result.success, duration: result.duration, summary: createSummary(result.data || {})
    })
  })
}

export async function getHistory() {
  if (!historyEnabled()) return []
  const query = new URLSearchParams({ select: 'id,tool,target,success,duration,summary,created_at', order: 'created_at.desc', limit: '12', browser_id: `eq.${browserId()}` })
  const response = await fetch(`${baseUrl}/rest/v1/tool_history?${query}`, { headers: headers() })
  if (!response.ok) throw new Error('Riwayat Supabase tidak dapat dimuat')
  return response.json()
}
