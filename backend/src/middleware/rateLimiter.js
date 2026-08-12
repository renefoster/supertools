const windowMs = Number(process.env.RATE_LIMIT_WINDOW_MS || 60000)
const maxRequests = Number(process.env.RATE_LIMIT_MAX || 30)
const clients = new Map()

export function rateLimiter(req, res, next) {
  const key = req.ip || req.socket.remoteAddress || 'unknown'
  const now = Date.now()
  const current = clients.get(key)
  if (!current || now - current.startedAt >= windowMs) {
    clients.set(key, { startedAt: now, count: 1 })
    return next()
  }
  if (current.count >= maxRequests) {
    const error = new Error('Rate limit exceeded')
    error.code = 'RATE_LIMITED'
    error.status = 429
    return next(error)
  }
  current.count += 1
  next()
}
