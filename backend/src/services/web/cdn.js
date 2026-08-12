import { request } from './request.js'

const PROVIDERS = [
  ['Cloudflare', ['cf-ray', 'cf-cache-status']],
  ['CloudFront', ['x-amz-cf-id', 'x-amz-cf-pop']],
  ['Fastly', ['x-served-by', 'x-cache-hits']],
  ['Akamai', ['x-akamai-transformed', 'akamai-grn']]
]

export async function run(target, options = {}) {
  const response = await request(target)
  const headers = response.headers
  const match = PROVIDERS.find(([, signals]) => signals.some((name) => headers.has(name)))
  const evidence = Object.fromEntries(PROVIDERS.flatMap(([, signals]) => signals.flatMap((name) => {
    const value = headers.get(name)
    return value === null ? [] : [[name, value]]
  })))
  return { detected: Boolean(match), provider: match?.[0] || null, evidence }
}
