import dns from 'node:dns/promises'
import { AppError } from '../../utils/errors.js'

const servers = ['zen.spamhaus.org', 'bl.spamcop.net', 'b.barracudacentral.org', 'dnsbl.sorbs.net', 'spamguard.leadmon.net']

export async function run(target) {
  const addresses = await dns.resolve4(target).catch(() => [])
  if (!addresses.length) throw new AppError('No IPv4 address found for blacklist check', 'BLACKLIST_DNS_FAILED', 422)
  const results = await Promise.all(addresses.slice(0, 3).flatMap((ip) => servers.map(async (server) => {
    const query = `${ip.split('.').reverse().join('.')}.${server}`
    const listed = await dns.resolve4(query).then(() => true).catch(() => false)
    return { ip, server, listed }
  })))
  return { addresses, servers, results, listed: results.some((result) => result.listed), listedCount: results.filter((result) => result.listed).length }
}
