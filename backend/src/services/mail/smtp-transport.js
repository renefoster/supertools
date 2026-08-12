import dns from 'node:dns/promises'
import net from 'node:net'
import tls from 'node:tls'
import { AppError } from '../../utils/errors.js'

const SMTP_TIMEOUT = Number(process.env.SMTP_TIMEOUT_MS || 20000)
const SMTP_RESPONSE_LIMIT = 16384

export async function mxHosts(target) {
  const records = await dns.resolveMx(target).catch(() => [])
  if (records.length) return records.sort((a, b) => a.priority - b.priority).map((record) => record.exchange)
  const addresses = await dns.resolve4(target).catch(() => [])
  if (addresses.length) return [target]
  throw new AppError('No mail server found for target domain', 'SMTP_MX_NOT_FOUND', 422)
}

export function readResponse(socket) {
  return new Promise((resolve, reject) => {
    let output = ''
    let settled = false
    const timer = setTimeout(() => finish(new AppError('SMTP response timed out', 'SMTP_TIMEOUT', 422)), SMTP_TIMEOUT)
    const finish = (error, value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      socket.off('data', onData)
      socket.off('error', onError)
      error ? reject(error) : resolve(value)
    }
    const onData = (chunk) => {
      output += chunk
      if (Buffer.byteLength(output, 'utf8') > SMTP_RESPONSE_LIMIT) return finish(new AppError('SMTP response exceeded limit', 'SMTP_RESPONSE_TOO_LARGE', 422))
      const lines = output.split(/\r?\n/)
      const final = lines.find((line) => /^\d{3} /.test(line))
      if (final) finish(null, { text: output.trim(), code: Number(final.slice(0, 3)) })
    }
    const onError = (error) => finish(new AppError(error.message || 'SMTP connection failed', error.code || 'SMTP_CONNECTION_FAILED', 422))
    socket.on('data', onData)
    socket.once('error', onError)
  })
}

export async function connect(host, port, secure = false) {
  const socket = secure ? tls.connect({ host, port, servername: host, rejectUnauthorized: false }) : net.createConnection({ host, port })
  const timer = setTimeout(() => socket.destroy(new Error('SMTP connection timed out')), SMTP_TIMEOUT)
  try {
    await new Promise((resolve, reject) => {
      socket.once(secure ? 'secureConnect' : 'connect', resolve)
      socket.once('error', reject)
    })
    clearTimeout(timer)
    return socket
  } catch (error) {
    clearTimeout(timer)
    socket.destroy()
    throw new AppError(error.message || 'SMTP connection failed', error.code || 'SMTP_CONNECTION_FAILED', 422)
  }
}

export async function command(socket, value) {
  socket.write(`${value}\r\n`)
  return readResponse(socket)
}

export async function probe(host, port) {
  const started = Date.now()
  try {
    const socket = await connect(host, port, port === 465)
    const banner = await readResponse(socket)
    socket.destroy()
    return { host, port, reachable: true, latencyMs: Date.now() - started, banner: banner.text, code: banner.code, error: null }
  } catch (error) {
    return { host, port, reachable: false, latencyMs: Date.now() - started, banner: null, code: null, error: error.code || error.message }
  }
}

export function upgradeToTls(socket, host) {
  return new Promise((resolve, reject) => {
    const secure = tls.connect({ socket, servername: host, rejectUnauthorized: false })
    const timer = setTimeout(() => { secure.destroy(); reject(new AppError('STARTTLS handshake timed out', 'STARTTLS_TIMEOUT', 422)) }, SMTP_TIMEOUT)
    secure.once('secureConnect', () => { clearTimeout(timer); resolve(secure) })
    secure.once('error', (error) => { clearTimeout(timer); reject(new AppError(error.message || 'STARTTLS handshake failed', error.code || 'STARTTLS_FAILED', 422)) })
  })
}
