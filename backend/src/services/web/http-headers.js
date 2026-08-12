import { request, responseHeaders } from './request.js'

export async function run(target, options = {}) {
  const response = await request(target)
  return { url: response.url, status: response.status, headers: responseHeaders(response) }
}
