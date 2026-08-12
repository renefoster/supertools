import { AppError } from '../../utils/errors.js'

export async function run(target) {
  const timeoutMs = Number(process.env.HTTP_TIMEOUT_MS || 15000)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`https://${target}`, { signal: controller.signal })
    const html = await response.text()
    const hints = []
    if (/wp-includes\//i.test(html)) hints.push('wp-includes exposed in page source')
    if (/wp-content\//i.test(html)) hints.push('wp-content exposed in page source')
    if (/\/wp-json\//i.test(html)) hints.push('REST API link exposed in page source')
    if (/generator["'][^>]+WordPress/i.test(html)) hints.push('WordPress generator metadata exposed')
    return { hints, count: hints.length }
  } catch (err) {
    if (err.name === 'AbortError') throw new AppError(`Request timed out after ${timeoutMs}ms`, 'HTTP_TIMEOUT', 422)
    throw new AppError(err.message || 'Failed to inspect database hints', 'HTTP_REQUEST_FAILED', 422)
  } finally { clearTimeout(timer) }
}
