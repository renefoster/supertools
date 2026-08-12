import { AppError } from '../../utils/errors.js'

export async function run(target) {
  const timeoutMs = Number(process.env.HTTP_TIMEOUT_MS || 15000)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`https://${target}`, { signal: controller.signal })
    const powered = response.headers.get('x-powered-by') || ''
    const match = powered.match(/PHP\/([\d.]+)/i)
    return { detected: Boolean(match), version: match?.[1] || null, source: match ? 'x-powered-by' : null }
  } catch (err) {
    if (err.name === 'AbortError') throw new AppError(`Request timed out after ${timeoutMs}ms`, 'HTTP_TIMEOUT', 422)
    throw new AppError(err.message || 'Failed to fetch homepage', 'HTTP_REQUEST_FAILED', 422)
  } finally { clearTimeout(timer) }
}
