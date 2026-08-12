import dns from 'node:dns/promises'
import net from 'node:net'
import { AppError } from '../../utils/errors.js'

function probe(address, port, timeoutMs) {
  return new Promise((resolve) => {
    const started = Date.now()
    const socket = net.createConnection({ host: address, port })
    let done = false
    const finish = (result) => {
      if (done) return
      done = true
      socket.destroy()
      resolve(result)
    }
    const timer = setTimeout(() => finish({ port, reachable: false, latencyMs: Date.now() - started, error: 'TCP_TIMEOUT' }), timeoutMs)
    socket.once('connect', () => { clearTimeout(timer); finish({ port, reachable: true, latencyMs: Date.now() - started, error: null }) })
    socket.once('error', (error) => { clearTimeout(timer); finish({ port, reachable: false, latencyMs: Date.now() - started, error: error.code || 'TCP_CONNECTION_FAILED' }) })
  })
}

export async function run(target) {
  const timeoutMs = Number(process.env.TCP_TIMEOUT_MS || 5000)
  let resolved
  try { resolved = await dns.lookup(target) } catch { throw new AppError('Domain could not be resolved', 'NETWORK_DNS_FAILED', 422) }
  const ports = await Promise.all([probe(resolved.address, 80, timeoutMs), probe(resolved.address, 443, timeoutMs)])
  return { address: resolved.address, family: resolved.family, reachable: ports.some((item) => item.reachable), latencyMs: Math.min(...ports.map((item) => item.latencyMs)), ports }
}
