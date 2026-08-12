import dns from 'node:dns/promises'

export async function run(target) {
  const addresses = await Promise.all([dns.resolve4(target).catch(() => []), dns.resolve6(target).catch(() => [])]).then((rows) => rows.flat())
  const records = await Promise.all(addresses.map(async (ip) => ({ ip, hostnames: await dns.reverse(ip).catch(() => []) })))
  return { addresses, records, hasPtr: records.some((record) => record.hostnames.length > 0), forwardConfirmed: records.some((record) => record.hostnames.includes(target)) }
}
