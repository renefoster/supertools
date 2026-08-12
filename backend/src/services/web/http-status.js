import { request } from './request.js'

const exposedHeaders = ['cache-control', 'content-length', 'content-type', 'date', 'location', 'server', 'strict-transport-security']

export async function run(target, options = {}) {
  const started = Date.now()
  const response = await request(target, '/', { redirect: 'follow' })
  const headers = Object.fromEntries(exposedHeaders.flatMap((name) => {
    const value = response.headers.get(name)
    return value === null ? [] : [[name, value]]
  }))
  return {
    url: response.url,
    status: response.status,
    statusText: response.statusText,
    ok: response.ok,
    redirected: response.redirected,
    duration: Date.now() - started,
    headers
  }
}
