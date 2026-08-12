function addValue(values, value) {
  if (value === null || value === undefined) return
  if (Array.isArray(value)) return value.forEach((item) => addValue(values, item))
  if (typeof value === 'object') {
    addValue(values, value.value ?? value.data ?? value.ip ?? value.address)
    return
  }
  const text = String(value)
  if (text.includes('.') || text.includes(':')) values.push(text)
}

export function getDnsMetrics(data = {}) {
  const values = []
  addValue(values, data.ipv4)
  addValue(values, data.ipv6)
  addValue(values, data.a)
  addValue(values, data.aaaa)
  addValue(values, data.ips)
  addValue(values, data.addresses)

  for (const record of data.records || []) {
    if (record.type === 'A' || record.type === 'AAAA') addValue(values, record.data ?? record.value)
  }
  for (const resolver of data.resolvers || []) {
    for (const answer of resolver.answers || []) addValue(values, answer.data ?? answer.value)
  }
  for (const nameserver of data.nameservers || []) {
    addValue(values, nameserver.address)
    addValue(values, nameserver.records?.A)
    addValue(values, nameserver.records?.AAAA)
  }

  const ips = [...new Set(values)]
  const ipv4 = ips.filter((ip) => ip.includes('.'))
  const ipv6 = ips.filter((ip) => ip.includes(':'))
  const counts = data.recordCounts || {}
  const recordCount = Object.keys(counts).length
    ? Object.values(counts).reduce((sum, count) => sum + Number(count || 0), 0)
    : Array.isArray(data.records) ? data.records.length : ips.length
  return {
    ipv4, ipv6, ips, recordCount,
    cnameCount: Number(counts.cname || 0), mxCount: Number(counts.mx || 0), nsCount: Number(counts.ns || 0),
    dualStack: ipv4.length > 0 && ipv6.length > 0
  }
}
