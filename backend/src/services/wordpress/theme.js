import { AppError } from '../../utils/errors.js'

export async function run(target) {
  const timeoutMs = Number(process.env.HTTP_TIMEOUT_MS || 15000)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`https://${target}`, { signal: controller.signal })
    const html = await response.text()
    const matches = [...html.matchAll(/\/wp-content\/themes\/([^/'"?]+)/gi)].map((match) => match[1])
    return { themes: [...new Set(matches)], active: matches[0] || null }
  } catch (err) {
    if (err.name === 'AbortError') throw new AppError(`Request timed out after ${timeoutMs}ms`, 'HTTP_TIMEOUT', 422)
    throw new AppError(err.message || 'Failed to inspect homepage', 'HTTP_REQUEST_FAILED', 422)
  } finally { clearTimeout(timer) }
}
