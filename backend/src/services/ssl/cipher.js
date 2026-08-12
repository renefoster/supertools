import { connect } from './tls.js'

export async function run(target, options = {}) {
  const result = await connect(target, options)
  return { protocol: result.protocol, cipher: result.cipher, authorized: result.authorized }
}
