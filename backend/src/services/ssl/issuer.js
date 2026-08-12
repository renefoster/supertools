import { connect } from './tls.js'

export async function run(target, options = {}) {
  const { certificate, authorized, authorizationError } = await connect(target, options)
  return { issuer: certificate.issuer, authorized, authorizationError }
}
