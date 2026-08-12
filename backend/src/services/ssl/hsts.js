import { AppError } from '../../utils/errors.js'

const TIMEOUT_MS = Number(process.env.HTTP_TIMEOUT_MS || 15000)

export async function run(target, options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const response = await fetch(`https://${target}`, { method: 'HEAD', signal: controller.signal, redirect: 'follow' })
    const header = response.headers.get('strict-transport-security')
    const maxAge = header?.match(/max-age=(\d+)/i)?.[1] || null
    return { present: Boolean(header), header, maxAge: maxAge === null ? null : Number(maxAge), includeSubDomains: /includesubdomains/i.test(header || ''), preload: /preload/i.test(header || '') }
  } catch (error) {
    if (error.name === 'AbortError') throw new AppError(`HSTS request timed out after ${TIMEOUT_MS}ms`, 'HTTP_TIMEOUT', 422)
    throw new AppError(error.message || 'HSTS request failed', 'HSTS_REQUEST_FAILED', 422)
  } finally {
    clearTimeout(timer)
  }
}
