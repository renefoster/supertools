import { AppError } from '../../utils/errors.js'

export async function run(target) {
  const timeoutMs = Number(process.env.HTTP_TIMEOUT_MS || 15000)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`https://${target}`, { signal: controller.signal })
    const headers = {}
    for (const name of ['cache-control', 'age', 'etag', 'expires', 'x-cache', 'x-cache-hit', 'cf-cache-status']) {
      const value = response.headers.get(name)
      if (value !== null) headers[name] = value
    }
    return { headers, cacheDetected: Object.keys(headers).length > 0 }
  } catch (err) {
    if (err.name === 'AbortError') throw new AppError(`Request timed out after ${timeoutMs}ms`, 'HTTP_TIMEOUT', 422)
    throw new AppError(err.message || 'Failed cache probe', 'HTTP_REQUEST_FAILED', 422)
  } finally { clearTimeout(timer) }
}
