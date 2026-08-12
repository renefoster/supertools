import tls from 'node:tls'
import { AppError } from '../../utils/errors.js'

const TIMEOUT_MS = Number(process.env.TLS_TIMEOUT_MS || 10000)

export function connect(target, options = {}) {
  const tlsOptions = { host: target, port: 443, servername: target, rejectUnauthorized: false, ...options }
  return new Promise((resolve, reject) => {
    let settled = false
    const socket = tls.connect(tlsOptions)
    const finish = (error, value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      socket.destroy()
      error ? reject(error) : resolve(value)
    }
    const timer = setTimeout(() => finish(new AppError(`TLS connection timed out after ${TIMEOUT_MS}ms`, 'SSL_TIMEOUT', 422)), TIMEOUT_MS)
    socket.once('secureConnect', () => {
      const certificate = socket.getPeerCertificate(true)
      finish(null, {
        socket,
        certificate,
        protocol: socket.getProtocol(),
        cipher: socket.getCipher()?.name || null,
        authorized: socket.authorized,
        authorizationError: socket.authorizationError || null
      })
    })
    socket.once('error', (error) => finish(new AppError(error.message || 'TLS connection failed', 'SSL_CHECK_FAILED', 422)))
  })
}

export function certificateData(result) {
  const certificate = result.certificate
  if (!certificate?.subject) throw new AppError('TLS certificate was not provided', 'SSL_CERTIFICATE_MISSING', 422)
  const validTo = new Date(certificate.valid_to)
  return {
    subject: certificate.subject,
    issuer: certificate.issuer,
    serialNumber: certificate.serialNumber,
    fingerprint: certificate.fingerprint,
    validFrom: certificate.valid_from,
    validTo: certificate.valid_to,
    daysRemaining: Math.floor((validTo.getTime() - Date.now()) / 86400000),
    subjectAltName: certificate.subjectaltname || null,
    protocol: result.protocol,
    cipher: result.cipher,
    authorized: result.authorized,
    authorizationError: result.authorizationError
  }
}
