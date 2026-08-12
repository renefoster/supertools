import { Router } from 'express'
import { validateTarget } from '../middleware/validateTarget.js'
import { rateLimiter } from '../middleware/rateLimiter.js'

import { run as version } from '../services/wordpress/version.js'
import { run as php } from '../services/wordpress/php.js'
import { run as theme } from '../services/wordpress/theme.js'
import { run as plugins } from '../services/wordpress/plugins.js'
import { run as restApi } from '../services/wordpress/rest-api.js'
import { run as xmlrpc } from '../services/wordpress/xmlrpc.js'
import { run as wpLogin } from '../services/wordpress/wp-login.js'
import { run as wpJson } from '../services/wordpress/wp-json.js'
import { run as securityHeaders } from '../services/wordpress/security-headers.js'
import { run as mixedContent } from '../services/wordpress/mixed-content.js'
import { run as ssl } from '../services/wordpress/ssl.js'
import { run as performance } from '../services/wordpress/performance.js'
import { run as cache } from '../services/wordpress/cache.js'
import { run as dbHints } from '../services/wordpress/db-hints.js'
import { run as vulnSignals } from '../services/wordpress/vuln-signals.js'

const router = Router()

function diagnostic(path, tool, service) {
  router.post(path, rateLimiter, validateTarget(tool), async (req, res, next) => {
    try {
      const data = await service(req.target, req.body?.options || {})
      res.json({ success: true, tool: req.toolName, target: req.target, duration: Date.now() - req.startTime, data, error: null })
    } catch (error) { next(error) }
  })
}

diagnostic('/version', 'wordpress-version', version)
diagnostic('/php', 'wordpress-php', php)
diagnostic('/theme', 'wordpress-theme', theme)
diagnostic('/plugins', 'wordpress-plugins', plugins)
diagnostic('/rest-api', 'wordpress-rest-api', restApi)
diagnostic('/xmlrpc', 'wordpress-xmlrpc', xmlrpc)
diagnostic('/wp-login', 'wordpress-wp-login', wpLogin)
diagnostic('/wp-json', 'wordpress-wp-json', wpJson)
diagnostic('/security-headers', 'wordpress-security-headers', securityHeaders)
diagnostic('/mixed-content', 'wordpress-mixed-content', mixedContent)
diagnostic('/ssl', 'wordpress-ssl', ssl)
diagnostic('/performance', 'wordpress-performance', performance)
diagnostic('/cache', 'wordpress-cache', cache)
diagnostic('/db-hints', 'wordpress-db-hints', dbHints)
diagnostic('/vuln-signals', 'wordpress-vuln-signals', vulnSignals)

export default router
