import dns from 'node:dns/promises'
import { AppError } from '../../utils/errors.js'

const DOH_SERVERS = {
  cloudflare: 'https://cloudflare-dns.com/dns-query',
  google: 'https://dns.google/resolve',
  quad9: 'https://dns.quad9.net:5053/dns-query'
}

async function doh(server, name, type, timeoutMs = 10000) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), timeoutMs)
  try {
    const response = await fetch(`${server}?name=${encodeURIComponent(name)}&type=${type}`, {
      headers: { accept: 'application/dns-json, application/json' }, signal: controller.signal
    })
    if (!response.ok) throw new Error(`DoH ${response.status}`)
    return response.json()
  } finally { clearTimeout(timer) }
}

async function safeDoh(server, name, type) {
  try { return await doh(server, name, type) } catch (error) { return { Status: -1, error: error.message } }
}

function answers(payload) {
  return (payload.Answer || []).map(({ name, type, TTL, data }) => ({ name, type, ttl: TTL, data }))
}

async function queryRecords(target, types = ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'SOA', 'CAA']) {
  const server = DOH_SERVERS.cloudflare
  const entries = await Promise.all(types.map(async (type) => [type, answers(await safeDoh(server, target, type))]))
  return Object.fromEntries(entries)
}

export async function propagation(target) {
  const resolvers = Object.entries(DOH_SERVERS)
  const rows = await Promise.all(resolvers.map(async ([resolver, server]) => {
    const result = await safeDoh(server, target, 'A')
    return { resolver, status: result.Status === 0 ? 'resolved' : result.error ? 'error' : 'not-found', answers: answers(result), ad: Boolean(result.AD), error: result.error || null }
  }))
  const addresses = [...new Set(rows.flatMap((row) => row.answers.map((answer) => answer.data)))]
  return { domain: target, resolvers: rows, consistent: rows.filter((row) => row.status === 'resolved').every((row) => row.answers.map((answer) => answer.data).sort().join() === addresses.sort().join()), addresses }
}

export async function dnssec(target) {
  const [dnskey, ds, rrsig] = await Promise.all(['DNSKEY', 'DS', 'RRSIG'].map((type) => doh(DOH_SERVERS.cloudflare, target, type).catch((error) => ({ Status: -1, error: error.message }))))
  const authenticated = [dnskey, ds, rrsig].some((result) => result.AD)
  const records = { dnskey: answers(dnskey), ds: answers(ds), rrsig: answers(rrsig) }
  return { status: authenticated ? 'authenticated' : records.dnskey.length || records.ds.length || records.rrsig.length ? 'records-found-not-validated' : 'not-found', authenticated, records, note: 'Status berasal dari metadata DoH; bukan validasi kriptografi lokal.' }
}

export async function nameservers(target) {
  const names = await dns.resolveNs(target).catch(() => [])
  const checks = await Promise.all(names.map(async (server) => {
    const address = await dns.lookup(server).catch(() => null)
    return { server, address: address?.address || null, reachable: Boolean(address) }
  }))
  return { nameservers: checks, count: checks.length }
}

export async function cnameChain(target) {
  const chain = []
  let current = target
  const seen = new Set()
  for (let index = 0; index < 10; index += 1) {
    if (seen.has(current)) return { chain, loop: true }
    seen.add(current)
    const next = await dns.resolveCname(current).catch(() => [])
    if (!next.length) break
    current = next[0]
    chain.push(current)
  }
  return { chain: [target, ...chain], hops: chain.length, loop: false, truncated: chain.length >= 10 }
}

export async function ttl(target) {
  const records = await queryRecords(target, ['A', 'AAAA', 'CNAME', 'MX', 'NS', 'TXT', 'SOA', 'CAA'])
  const all = Object.entries(records).flatMap(([type, values]) => values.map((record) => ({ type, ttl: record.ttl, data: record.data })))
  const ttls = all.map((record) => record.ttl).filter((value) => Number.isInteger(value))
  return { records: all, min: ttls.length ? Math.min(...ttls) : null, max: ttls.length ? Math.max(...ttls) : null, average: ttls.length ? Math.round(ttls.reduce((sum, value) => sum + value, 0) / ttls.length) : null }
}

export async function reverse(target) {
  const addresses = await Promise.all([dns.resolve4(target).catch(() => []), dns.resolve6(target).catch(() => [])]).then((rows) => rows.flat())
  const records = await Promise.all(addresses.map(async (ip) => ({ ip, hostnames: await dns.reverse(ip).catch(() => []) })))
  return { addresses, records }
}

export async function ipVersions(target) {
  const [ipv4, ipv6] = await Promise.all([dns.resolve4(target).catch(() => []), dns.resolve6(target).catch(() => [])])
  return { ipv4, ipv6, hasIpv4: ipv4.length > 0, hasIpv6: ipv6.length > 0, dualStack: ipv4.length > 0 && ipv6.length > 0 }
}

export async function authoritative(target) {
  const ns = await dns.resolveNs(target).catch(() => [])
  if (!ns.length) throw new AppError('Authoritative nameservers not found', 'AUTHORITATIVE_NS_NOT_FOUND', 422)
  const checks = await Promise.all(ns.map(async (server) => {
    const records = await queryRecords(target, ['A', 'AAAA', 'MX', 'NS', 'SOA']).catch((error) => ({ error: error.message }))
    return { server, records, queriedThrough: DOH_SERVERS.cloudflare }
  }))
  return { nameservers: checks, note: 'Hybrid mode uses public DoH for record reads and native DNS for NS discovery.' }
}

export async function inspect(target) {
  const groups = await queryRecords(target)
  const records = Object.entries(groups).flatMap(([type, entries]) => entries.map((entry) => ({ type, ...entry })))
  const ips = records.filter((entry) => entry.type === 'A' || entry.type === 'AAAA').map((entry) => entry.data)
  return {
    records,
    recordCounts: Object.fromEntries(Object.entries(groups).map(([type, entries]) => [type.toLowerCase(), entries.length])),
    ips,
    empty: records.length === 0
  }
}
