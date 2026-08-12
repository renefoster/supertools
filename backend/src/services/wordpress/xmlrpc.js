import { AppError } from '../../utils/errors.js'

export async function run(target) {
  const timeoutMs = Number(process.env.HTTP_TIMEOUT_MS || 15000)
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`https://${target}/xmlrpc.php`, { signal: controller.signal })
    const body = await response.text()
    const enabled = response.status !== 404 && /XML-RPC server accepts POST requests only/i.test(body)
    return { enabled, status: response.status, message: body.slice(0, 200) }
  } catch (err) {
    if (err.name === 'AbortError') throw new AppError(`Request timed out after ${timeoutMs}ms`, 'HTTP_TIMEOUT', 422)
    throw new AppError(err.message || 'Failed to inspect XML-RPC endpoint', 'HTTP_REQUEST_FAILED', 422)
  } finally { clearTimeout(timer) }
}
