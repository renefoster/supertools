import { Router } from 'express'
import { run } from '../services/network/connectivity.js'
import { validateTarget } from '../middleware/validateTarget.js'

const router = Router()
router.post('/connectivity', validateTarget('network-connectivity'), async (req, res, next) => {
  try {
    const data = await run(req.target)
    res.json({ success: true, tool: req.toolName, target: req.target, duration: Date.now() - req.startTime, data, error: null })
  } catch (error) { next(error) }
})
export default router
