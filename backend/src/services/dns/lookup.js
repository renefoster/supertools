import dns from 'node:dns/promises'
import { AppError } from '../../utils/errors.js'


async function safe(query) {
  try { return await query() } catch { return [] }
}

function values(records) {
  return records.map((record) => typeof record === 'string' ? { value: record, ttl: null } : { value: record.address, ttl: record.ttl })
}

export async function run(target) {
  const [a, aaaa, cname, mx, ns, txt, soa, caa] = await Promise.all([
    safe(() => dns.resolve4(target, { ttl: true })),
    safe(() => dns.resolve6(target, { ttl: true })),
    safe(() => dns.resolveCname(target)),
    safe(() => dns.resolveMx(target)),
    safe(() => dns.resolveNs(target)),
    safe(() => dns.resolveTxt(target)),
    safe(() => dns.resolveSoa(target)),
    safe(() => dns.resolveCaa(target))
  ])
  const ipv4 = values(a)
  const ipv6 = values(aaaa)
  const ips = [...new Set([...ipv4, ...ipv6].map((record) => record.value))]
  if (!ips.length && !cname.length && !ns.length) throw new AppError('DNS records could not be resolved', 'DNS_LOOKUP_FAILED', 422)
  const reverse = await Promise.all(ips.slice(0, 10).map(async (ip) => ({ ip, hostnames: await safe(() => dns.reverse(ip)) })))
  return {
    ips, ipv4, ipv6, cname: cname.map((value) => ({ value, ttl: null })),
    mx, ns, txt: txt.map((parts) => parts.join('')), soa: soa[0] || null, caa,
    reverse, recordCounts: { a: ipv4.length, aaaa: ipv6.length, cname: cname.length, mx: mx.length, ns: ns.length, txt: txt.length, caa: caa.length },
    dnssec: { status: 'not-analyzed', message: 'DNSSEC perlu query DNS wire/DoH khusus.' }
  }
}
