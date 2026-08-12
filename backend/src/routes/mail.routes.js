import { Router } from 'express'
import { validateTarget } from '../middleware/validateTarget.js'
import { rateLimiter } from '../middleware/rateLimiter.js'
import { run as mx } from '../services/mail/mx.js'
import { run as smtpTest } from '../services/mail/smtp-test.js'
import { run as smtpBanner } from '../services/mail/smtp-banner.js'
import { run as spf } from '../services/mail/spf.js'
import { run as dkim } from '../services/mail/dkim.js'
import { run as dmarc } from '../services/mail/dmarc.js'
import { run as ptr } from '../services/mail/ptr.js'
import { run as tls } from '../services/mail/tls.js'
import { run as starttls } from '../services/mail/starttls.js'
import { run as blacklist } from '../services/mail/blacklist.js'
import { run as connectivity } from '../services/mail/connectivity.js'

const router = Router()

function diagnostic(path, tool, service) {
  router.post(path, rateLimiter, validateTarget(tool), async (req, res, next) => {
    try {
      const data = await service(req.target, req.body?.options || {})
      res.json({ success: true, tool: req.toolName, target: req.target, duration: Date.now() - req.startTime, data, error: null })
    } catch (error) { next(error) }
  })
}

diagnostic('/mx', 'mail-mx-lookup', mx)
diagnostic('/smtp-test', 'mail-smtp-test', smtpTest)
diagnostic('/smtp-banner', 'mail-smtp-banner', smtpBanner)
diagnostic('/spf', 'mail-spf-analyzer', spf)
diagnostic('/dkim', 'mail-dkim-analyzer', dkim)
diagnostic('/dmarc', 'mail-dmarc-analyzer', dmarc)
diagnostic('/ptr', 'mail-ptr-lookup', ptr)
diagnostic('/tls', 'mail-tls-check', tls)
diagnostic('/starttls', 'mail-starttls', starttls)
diagnostic('/blacklist', 'mail-blacklist-check', blacklist)
diagnostic('/connectivity', 'mail-smtp-connectivity', connectivity)

export default router
