import { certificateData, connect } from './tls.js'

export async function run(target, options = {}) {
  return certificateData(await connect(target, options))
}
