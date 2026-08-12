import { Router } from 'express'
import { validateTarget } from '../middleware/validateTarget.js'
import { rateLimiter } from '../middleware/rateLimiter.js'
import { run as certificate } from '../services/ssl/certificate.js'
import { run as issuer } from '../services/ssl/issuer.js'
import { run as expiration } from '../services/ssl/expiration.js'
import { run as san } from '../services/ssl/san.js'
import { run as chain } from '../services/ssl/chain.js'
import { run as tls12 } from '../services/ssl/tls12.js'
import { run as tls13 } from '../services/ssl/tls13.js'
import { run as cipher } from '../services/ssl/cipher.js'
import { run as ocsp } from '../services/ssl/ocsp.js'
import { run as hsts } from '../services/ssl/hsts.js'
import { run as ct } from '../services/ssl/ct.js'

const router = Router()

function diagnostic(path, tool, service) {
  router.post(path, rateLimiter, validateTarget(tool), async (req, res, next) => {
    try {
      const data = await service(req.target, req.body?.options || {})
      res.json({ success: true, tool: req.toolName, target: req.target, duration: Date.now() - req.startTime, data, error: null })
    } catch (error) { next(error) }
  })
}

diagnostic('/certificate', 'ssl-certificate', certificate)
diagnostic('/issuer', 'ssl-issuer', issuer)
diagnostic('/expiration', 'ssl-expiration', expiration)
diagnostic('/san', 'ssl-san', san)
diagnostic('/chain', 'ssl-chain', chain)
diagnostic('/tls12', 'ssl-tls12', tls12)
diagnostic('/tls13', 'ssl-tls13', tls13)
diagnostic('/cipher', 'ssl-cipher', cipher)
diagnostic('/ocsp', 'ssl-ocsp', ocsp)
diagnostic('/hsts', 'ssl-hsts', hsts)
diagnostic('/ct', 'ssl-ct', ct)

export default router
