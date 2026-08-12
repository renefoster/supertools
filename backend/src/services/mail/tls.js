import tls from 'node:tls'
import dns from 'node:dns/promises'
import { AppError } from '../../utils/errors.js'

export async function run(target) {
  const records = await dns.resolveMx(target).catch(() => [])
  const host = records.sort((a, b) => a.priority - b.priority)[0]?.exchange || target
  const port = Number(process.env.SMTP_TLS_PORT || 465)
  const timeoutMs = Number(process.env.TLS_TIMEOUT_MS || 10000)
  return new Promise((resolve, reject) => {
    let settled = false
    const socket = tls.connect({ host, port, servername: host, rejectUnauthorized: false })
    const finish = (error, value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      socket.destroy()
      error ? reject(error) : resolve(value)
    }
    const timer = setTimeout(() => finish(new AppError(`TLS connection timed out after ${timeoutMs}ms`, 'SMTP_TLS_TIMEOUT', 422)), timeoutMs)
    socket.once('secureConnect', () => {
      const certificate = socket.getPeerCertificate()
      finish(null, { host, port, protocol: socket.getProtocol(), cipher: socket.getCipher()?.name || null, authorized: socket.authorized, authorizationError: socket.authorizationError || null, certificate: certificate.subject ? { subject: certificate.subject, issuer: certificate.issuer, validFrom: certificate.valid_from, validTo: certificate.valid_to, fingerprint: certificate.fingerprint, subjectAltName: certificate.subjectaltname || null } : null })
    })
    socket.once('error', (error) => finish(new AppError(error.message || 'Mail TLS check failed', error.code || 'SMTP_TLS_FAILED', 422)))
  })
}
