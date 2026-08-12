import { request } from './request.js'

export async function run(target, options = {}) {
  const response = await request(target, '/', { headers: { 'accept-encoding': 'gzip, deflate, br' } })
  const encoding = response.headers.get('content-encoding')
  return {
    supported: Boolean(encoding),
    encoding,
    contentLength: response.headers.get('content-length'),
    vary: response.headers.get('vary')
  }
}
