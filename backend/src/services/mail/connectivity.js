import { mxHosts, probe } from './smtp-transport.js'

const SMTP_PORTS = (process.env.SMTP_CONNECTIVITY_PORTS || '25,465,587,2525').split(',').map(Number).filter(Number.isInteger)

export async function run(target) {
  const host = (await mxHosts(target))[0]
  const ports = await Promise.all(SMTP_PORTS.map((port) => probe(host, port)))
  return { host, ports, reachable: ports.some((item) => item.reachable), openPorts: ports.filter((item) => item.reachable).map((item) => item.port) }
}
