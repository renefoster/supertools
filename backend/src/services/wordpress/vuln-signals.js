import { AppError } from '../../utils/errors.js'

export async function run(target) {
  const timeoutMs = Number(process.env.HTTP_TIMEOUT_MS || 15000)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`https://${target}`, { signal: controller.signal })
    const html = await response.text()
    const signals = []
    if (/wp-login\.php/i.test(html)) signals.push('wp-login link exposed')
    if (/xmlrpc\.php/i.test(html)) signals.push('XML-RPC reference exposed')
    if (/wp-content\/plugins\//i.test(html)) signals.push('plugin paths exposed')
    if (/meta name=["']generator["'] content=["']WordPress/i.test(html)) signals.push('WordPress version metadata exposed')
    return { signals, count: signals.length, note: 'Signals are not vulnerability findings.' }
  } catch (err) {
    if (err.name === 'AbortError') throw new AppError(`Request timed out after ${timeoutMs}ms`, 'HTTP_TIMEOUT', 422)
    throw new AppError(err.message || 'Failed to inspect vulnerability signals', 'HTTP_REQUEST_FAILED', 422)
  } finally { clearTimeout(timer) }
}
