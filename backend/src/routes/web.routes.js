import { Router } from 'express'
import { validateTarget } from '../middleware/validateTarget.js'
import { rateLimiter } from '../middleware/rateLimiter.js'
import { run as httpStatus } from '../services/web/http-status.js'
import { run as redirectChain } from '../services/web/redirect-chain.js'
import { run as ssl } from '../services/web/ssl.js'
import { run as certificate } from '../services/web/certificate.js'
import { run as securityHeaders } from '../services/web/security-headers.js'
import { run as httpHeaders } from '../services/web/http-headers.js'
import { run as compression } from '../services/web/compression.js'
import { run as http2 } from '../services/web/http2.js'
import { run as http3 } from '../services/web/http3.js'
import { run as responseTime } from '../services/web/response-time.js'
import { run as server } from '../services/web/server.js'
import { run as cdn } from '../services/web/cdn.js'
import { run as techstack } from '../services/web/techstack.js'
import { run as whois } from '../services/web/whois.js'

const router = Router()

function diagnostic(path, tool, service) {
  router.post(path, rateLimiter, validateTarget(tool), async (req, res, next) => {
    try {
      const data = await service(req.target, req.body?.options || {})
      res.json({ success: true, tool: req.toolName, target: req.target, duration: Date.now() - req.startTime, data, error: null })
    } catch (error) { next(error) }
  })
}

diagnostic('/http-status', 'web-http-status', httpStatus)
diagnostic('/redirect-chain', 'web-redirect-chain', redirectChain)
diagnostic('/ssl', 'web-ssl', ssl)
diagnostic('/certificate', 'web-certificate', certificate)
diagnostic('/security-headers', 'web-security-headers', securityHeaders)
diagnostic('/http-headers', 'web-http-headers', httpHeaders)
diagnostic('/compression', 'web-compression', compression)
diagnostic('/http2', 'web-http2', http2)
diagnostic('/http3', 'web-http3', http3)
diagnostic('/response-time', 'web-response-time', responseTime)
diagnostic('/server', 'web-server', server)
diagnostic('/cdn', 'web-cdn', cdn)
diagnostic('/techstack', 'web-techstack', techstack)
diagnostic('/whois', 'web-whois', whois)

export default router
