import { mxHosts, probe } from './smtp-transport.js'
import { AppError } from '../../utils/errors.js'

const SMTP_BANNER_PORT = Number(process.env.SMTP_BANNER_PORT || 25)

export async function run(target) {
  const host = (await mxHosts(target))[0]
  const result = await probe(host, SMTP_BANNER_PORT)
  if (!result.reachable) throw new AppError(`SMTP banner unavailable: ${result.error}`, 'SMTP_BANNER_FAILED', 422)
  return result
}
