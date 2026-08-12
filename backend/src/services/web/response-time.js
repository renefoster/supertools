import { request } from './request.js'

export async function run(target, options = {}) {
  const started = Date.now()
  const response = await request(target)
  await response.body?.cancel()
  return { status: response.status, url: response.url, duration: Date.now() - started }
}
