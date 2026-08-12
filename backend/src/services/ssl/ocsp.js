import { connect } from './tls.js'

export async function run(target, options = {}) {
  const { certificate } = await connect(target, options)
  return {
    stapled: false,
    responderUrls: certificate.infoAccess?.['OCSP - URI'] || [],
    note: 'Passive metadata only; this tool does not send an OCSP request.'
  }
}
