import { AppError } from '../../utils/errors.js'

export async function run(target) {
  const timeoutMs = Number(process.env.HTTP_TIMEOUT_MS || 15000)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  const started = Date.now()
  try {
    const response = await fetch(`https://${target}`, { signal: controller.signal })
    await response.arrayBuffer()
    return { status: response.status, duration: Date.now() - started, contentLength: response.headers.get('content-length') }
  } catch (err) {
    if (err.name === 'AbortError') throw new AppError(`Request timed out after ${timeoutMs}ms`, 'HTTP_TIMEOUT', 422)
    throw new AppError(err.message || 'Failed performance probe', 'HTTP_REQUEST_FAILED', 422)
  } finally { clearTimeout(timer) }
}
