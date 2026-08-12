import { AppError } from '../../utils/errors.js'

export async function run(target) {
  const timeoutMs = Number(process.env.HTTP_TIMEOUT_MS || 15000)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`https://${target}/wp-json/`, { signal: controller.signal })
    const contentType = response.headers.get('content-type') || ''
    const body = contentType.includes('json') ? await response.json() : await response.text()
    return { available: response.ok, status: response.status, contentType, body }
  } catch (err) {
    if (err.name === 'AbortError') throw new AppError(`Request timed out after ${timeoutMs}ms`, 'HTTP_TIMEOUT', 422)
    throw new AppError(err.message || 'Failed to query WordPress REST API', 'HTTP_REQUEST_FAILED', 422)
  } finally { clearTimeout(timer) }
}
