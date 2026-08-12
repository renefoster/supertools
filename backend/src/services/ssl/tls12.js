import { connect } from './tls.js'

export async function run(target, options = {}) {
  const result = await connect(target, { ...options, minVersion: 'TLSv1.2', maxVersion: 'TLSv1.2' })
  return { supported: result.protocol === 'TLSv1.2', protocol: result.protocol, cipher: result.cipher }
}
