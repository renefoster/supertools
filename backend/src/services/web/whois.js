import { run as lookup } from '../domain/whois.js'

export async function run(target, options = {}) {
  return lookup(target, options)
}
