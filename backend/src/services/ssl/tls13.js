import { connect } from './tls.js'

export async function run(target, options = {}) {
  const result = await connect(target, { ...options, minVersion: 'TLSv1.3', maxVersion: 'TLSv1.3' })
  return { supported: result.protocol === 'TLSv1.3', protocol: result.protocol, cipher: result.cipher }
}
