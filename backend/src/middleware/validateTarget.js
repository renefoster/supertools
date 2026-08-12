import { AppError } from '../utils/errors.js'
import { normalizeDomain } from '../utils/domain.js'

export function validateTarget(tool) {
  return (req, res, next) => {
    req.startTime = Date.now()
    req.toolName = tool
    const domain = normalizeDomain(req.body?.target)
    if (!domain) return next(new AppError('Enter a valid domain name, not a URL or IP address', 'INVALID_DOMAIN', 400))
    req.target = domain
    next()
  }
}
