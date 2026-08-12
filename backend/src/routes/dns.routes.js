import { Router } from 'express'
import { run } from '../services/dns/lookup.js'
import { authoritative, cnameChain, dnssec, inspect, ipVersions, nameservers, propagation, reverse, ttl } from '../services/dns/advanced.js'
import { validateTarget } from '../middleware/validateTarget.js'

const router = Router()

function diagnostic(path, tool, service) {
  router.post(path, validateTarget(tool), async (req, res, next) => {
    try {
      const data = await service(req.target)
      res.json({ success: true, tool: req.toolName, target: req.target, duration: Date.now() - req.startTime, data, error: null })
    } catch (error) { next(error) }
  })
}

diagnostic('/lookup', 'dns-lookup', run)
diagnostic('/propagation', 'dns-propagation', propagation)
diagnostic('/records', 'dns-record-inspector', inspect)
diagnostic('/dnssec', 'dnssec-analyzer', dnssec)
diagnostic('/nameservers', 'nameserver-checker', nameservers)
diagnostic('/cname-chain', 'cname-chain', cnameChain)
diagnostic('/ttl', 'ttl-analyzer', ttl)
diagnostic('/reverse', 'reverse-dns', reverse)
diagnostic('/ip-versions', 'ip-versions', ipVersions)
diagnostic('/authoritative', 'authoritative-dns', authoritative)

export default router
