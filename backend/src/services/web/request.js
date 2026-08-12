import { AppError } from '../../utils/errors.js'

const TIMEOUT_MS = Number(process.env.HTTP_TIMEOUT_MS || 15000)

export async function request(target, path = '/', options = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  const url = /^https?:\/\//i.test(path) ? path : `https://${target}${path}`
  try {
    return await fetch(url, { ...options, signal: controller.signal })
  } catch (error) {
    if (error.name === 'AbortError') throw new AppError(`HTTP request timed out after ${TIMEOUT_MS}ms`, 'HTTP_TIMEOUT', 422)
    throw new AppError(error.message || 'HTTP request failed', 'HTTP_REQUEST_FAILED', 422)
  } finally {
    clearTimeout(timer)
  }
}

export function responseHeaders(response) {
  return Object.fromEntries(response.headers.entries())
}
