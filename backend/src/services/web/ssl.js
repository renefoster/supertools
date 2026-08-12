import tls from 'node:tls'
import { AppError } from '../../utils/errors.js'

export async function run(target, options = {}) {
  const timeoutMs = Number(process.env.TLS_TIMEOUT_MS || 10000)
  return new Promise((resolve, reject) => {
    let settled = false
    const socket = tls.connect({ host: target, port: 443, servername: target, rejectUnauthorized: false })
    const finish = (error, value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      socket.destroy()
      error ? reject(error) : resolve(value)
    }
    const timer = setTimeout(() => finish(new AppError(`TLS connection timed out after ${timeoutMs}ms`, 'SSL_TIMEOUT', 422)), timeoutMs)
    socket.once('secureConnect', () => finish(null, {
      protocol: socket.getProtocol(),
      cipher: socket.getCipher()?.name || null,
      authorized: socket.authorized,
      authorizationError: socket.authorizationError || null
    }))
    socket.once('error', (error) => finish(new AppError(error.message || 'TLS check failed', 'SSL_CHECK_FAILED', 422)))
  })
}
