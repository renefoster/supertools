import { connect } from './tls.js'

export async function run(target, options = {}) {
  const { certificate } = await connect(target, options)
  const value = certificate.subjectaltname || ''
  const names = value.split(/,\s*/).map((item) => item.replace(/^DNS:/i, '')).filter((item) => item && !item.includes(':'))
  return { names, count: names.length, raw: value || null }
}
