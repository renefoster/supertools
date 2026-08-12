import { connect } from './tls.js'

export async function run(target, options = {}) {
  const { certificate } = await connect(target, options)
  const chain = []
  const seen = new Set()
  let current = certificate
  while (current?.subject && current.fingerprint && !seen.has(current.fingerprint)) {
    seen.add(current.fingerprint)
    chain.push({ subject: current.subject, issuer: current.issuer, serialNumber: current.serialNumber, fingerprint: current.fingerprint, validTo: current.valid_to })
    if (!current.issuerCertificate || current.issuerCertificate === current) break
    current = current.issuerCertificate
  }
  return { chain, depth: chain.length }
}
