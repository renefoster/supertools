import http2 from 'node:http2'
import { AppError } from '../../utils/errors.js'

export async function run(target, options = {}) {
  const timeoutMs = Number(process.env.HTTP_TIMEOUT_MS || 15000)
  return new Promise((resolve, reject) => {
    let settled = false
    const client = http2.connect(`https://${target}`)
    const finish = (error, value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      client.close()
      error ? reject(error) : resolve(value)
    }
    const timer = setTimeout(() => finish(new AppError(`HTTP/2 request timed out after ${timeoutMs}ms`, 'HTTP2_TIMEOUT', 422)), timeoutMs)
    client.once('error', (error) => finish(new AppError(error.message || 'HTTP/2 request failed', 'HTTP2_REQUEST_FAILED', 422)))
    const request = client.request({ ':path': '/', ':method': 'HEAD' })
    request.once('response', (headers) => finish(null, { supported: true, status: headers[':status'] || null, protocol: 'h2' }))
    request.once('error', (error) => finish(new AppError(error.message || 'HTTP/2 request failed', 'HTTP2_REQUEST_FAILED', 422)))
    request.end()
  })
}
