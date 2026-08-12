import { request } from './request.js'

export async function run(target, options = {}) {
  const response = await request(target)
  return {
    server: response.headers.get('server'),
    poweredBy: response.headers.get('x-powered-by'),
    via: response.headers.get('via')
  }
}
