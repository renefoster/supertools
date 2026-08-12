import { request } from './request.js'

const HEADER_NAMES = ['content-security-policy', 'permissions-policy', 'referrer-policy', 'strict-transport-security', 'x-content-type-options', 'x-frame-options']

export async function run(target, options = {}) {
  const response = await request(target)
  const headers = Object.fromEntries(HEADER_NAMES.flatMap((name) => {
    const value = response.headers.get(name)
    return value === null ? [] : [[name, value]]
  }))
  return { status: response.status, headers, missing: HEADER_NAMES.filter((name) => !(name in headers)) }
}
