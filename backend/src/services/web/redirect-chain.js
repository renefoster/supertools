import { AppError } from '../../utils/errors.js'
import { request } from './request.js'

const MAX_REDIRECTS = 10

export async function run(target, options = {}) {
  const chain = []
  const visited = new Set()
  let url = `https://${target}`

  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    if (visited.has(url)) throw new AppError('Redirect loop detected', 'REDIRECT_LOOP', 422)
    visited.add(url)
    const nextUrl = new URL(url)
    const response = await request(nextUrl.hostname, nextUrl.pathname + nextUrl.search, { redirect: 'manual' })
    const location = response.headers.get('location')
    chain.push({ url, status: response.status, location })
    if (!location || response.status < 300 || response.status >= 400) return { chain, finalUrl: url, redirected: chain.length > 1 }
    url = new URL(location, url).toString()
    if (!['http:', 'https:'].includes(new URL(url).protocol)) throw new AppError('Redirect uses an unsupported protocol', 'REDIRECT_PROTOCOL', 422)
  }

  throw new AppError(`Redirect chain exceeded ${MAX_REDIRECTS} hops`, 'REDIRECT_LIMIT', 422)
}
