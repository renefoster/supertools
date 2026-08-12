import net from 'node:net'
import { AppError } from '../../utils/errors.js'
import { readSocket } from '../../utils/socket.js'

function parseWhois(raw) {
  const fields = {}
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^([^:#]+):\s*(.+)$/)
    if (!match) continue
    const key = match[1].trim().toLowerCase().replace(/\s+/g, '_')
    fields[key] ??= []
    fields[key].push(match[2].trim())
  }
  return fields
}

function query(server, target, timeoutMs, maxBytes) {
  return new Promise((resolve, reject) => {
    const socket = net.createConnection({ host: server, port: 43 }, () => socket.write(`${target}\r\n`))
    readSocket(socket, { timeoutMs, maxBytes, timeoutCode: 'WHOIS_TIMEOUT', label: 'WHOIS query' }).then(resolve, reject)
    socket.once('error', reject)
  })
}

export async function run(target) {
  const timeoutMs = Number(process.env.WHOIS_TIMEOUT_MS || 10000)
  const maxBytes = Number(process.env.WHOIS_MAX_BYTES || 65536)
  let iana
  try { iana = await query('whois.iana.org', target, timeoutMs, maxBytes) } catch (error) {
    throw new AppError(error.message || 'WHOIS query failed', error.code || 'WHOIS_LOOKUP_FAILED', 422)
  }
  const referral = iana.match(/^refer:\s*(\S+)/im)?.[1]
  let raw = iana
  if (referral) {
    try { raw = await query(referral, target, timeoutMs, maxBytes) } catch { raw = iana }
  }
  const fields = parseWhois(raw)
  return {
    server: referral || 'whois.iana.org',
    registrar: fields.registrar?.[0] || fields.registrar_name?.[0] || null,
    created: fields.creation_date?.[0] || fields.created?.[0] || null,
    expires: fields.registry_expiry_date?.[0] || fields.expiration_date?.[0] || fields.expires?.[0] || null,
    nameservers: [...new Set([...(fields.name_server || []), ...(fields.nserver || [])])],
    status: fields.domain_status || fields.status || [],
    raw: raw.slice(0, maxBytes)
  }
}
