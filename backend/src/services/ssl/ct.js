import { connect } from './tls.js'

export async function run(target, options = {}) {
  const { certificate } = await connect(target, options)
  return {
    available: false,
    subject: certificate.subject,
    note: 'Node TLS peer certificates do not expose SCT data. No CT log query was sent.'
  }
}
