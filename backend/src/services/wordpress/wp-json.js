import { AppError } from '../../utils/errors.js'

export async function run(target) {
  const timeoutMs = Number(process.env.HTTP_TIMEOUT_MS || 15000)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`https://${target}/wp-json/`, { signal: controller.signal })
    const body = await response.json()
    return { available: true, body, duration: Date.now() - (response.headers.get('date') ? new Date(response.headers.get('date')).getTime() : Date.now()) }
  } catch (err) {
    if (err.name === 'AbortError') throw new AppError(`Request timed out after ${timeoutMs}ms`, 'HTTP_TIMEOUT', 422)
    throw new AppError(err.message || 'Failed to fetch wp-json', 'HTTP_REQUEST_FAILED', 422)
  } finally { clearTimeout(timer) }
}
