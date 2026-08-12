import { AppError } from '../../utils/errors.js'

export async function run(target) {
  const timeoutMs = Number(process.env.HTTP_TIMEOUT_MS || 15000)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`https://${target}`, { signal: controller.signal })
    const headers = {}
    for (const [k, v] of response.headers.entries()) {
      if (/^strict-transport-security$|^content-security-policy$|^x-frame-options$|^x-content-type-options$/i.test(k)) {
        headers[k] = v
      }
    }
    return { headers, status: response.status }
  } catch (err) {
    if (err.name === 'AbortError') throw new AppError(`Request timed out after ${timeoutMs}ms`, 'HTTP_TIMEOUT', 422)
    throw new AppError(err.message || 'Failed to fetch homepage headers', 'HTTP_REQUEST_FAILED', 422)
  } finally { clearTimeout(timer) }
}
