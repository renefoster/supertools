/**
 * WordPress version detection via homepage meta generator tag.
 * Passes target domain (e.g., example.com).
 */
import { AppError } from '../../utils/errors.js'

export async function run(target) {
  const timeoutMs = Number(process.env.HTTP_TIMEOUT_MS || 15000)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  const url = `https://${target}`
  const started = Date.now()
  try {
    const response = await fetch(url, { signal: controller.signal })
    const html = await response.text()
    const match = html.match(/<meta name=["']generator["'] content=["']WordPress\s+([\d.]+)["']>/i)
    const version = match ? match[1] : null
    if (!version) throw new AppError('WordPress version not detected', 'WP_VERSION_NOT_FOUND', 422)
    return { version, duration: Date.now() - started }
  } catch (err) {
    if (err.name === 'AbortError') throw new AppError(`Request timed out after ${timeoutMs}ms`, 'HTTP_TIMEOUT', 422)
    throw new AppError(err.message || 'Failed to fetch homepage', 'HTTP_REQUEST_FAILED', 422)
  } finally { clearTimeout(timer) }
}
