import dns from 'node:dns/promises'
import { AppError } from '../../utils/errors.js'

export async function run(target) {
  const records = await dns.resolveMx(target).catch(() => [])
  const sorted = records.sort((a, b) => a.priority - b.priority)
  if (!sorted.length) throw new AppError('No MX records found for target domain', 'MX_LOOKUP_FAILED', 422)
  return { records: sorted, count: sorted.length, primary: sorted[0] }
}
