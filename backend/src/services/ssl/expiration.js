import { certificateData, connect } from './tls.js'

export async function run(target, options = {}) {
  const certificate = certificateData(await connect(target, options))
  return { validFrom: certificate.validFrom, validTo: certificate.validTo, daysRemaining: certificate.daysRemaining, expired: certificate.daysRemaining < 0 }
}
