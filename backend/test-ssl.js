import test from 'node:test'
import assert from 'node:assert/strict'

import { run as certificate } from './src/services/ssl/certificate.js'
import { run as issuer } from './src/services/ssl/issuer.js'
import { run as expiration } from './src/services/ssl/expiration.js'
import { run as san } from './src/services/ssl/san.js'
import { run as chain } from './src/services/ssl/chain.js'
import { run as tls12 } from './src/services/ssl/tls12.js'
import { run as tls13 } from './src/services/ssl/tls13.js'
import { run as cipher } from './src/services/ssl/cipher.js'
import { run as ocsp } from './src/services/ssl/ocsp.js'
import { run as hsts } from './src/services/ssl/hsts.js'
import { run as ct } from './src/services/ssl/ct.js'

test('SSL services export required run signature', () => {
  for (const service of [certificate, issuer, expiration, san, chain, tls12, tls13, cipher, ocsp, hsts, ct]) {
    assert.equal(typeof service, 'function')
    assert.ok(service.length >= 1)
  }
})

test('OCSP and CT services remain passive metadata probes', () => {
  assert.equal(typeof ocsp, 'function')
  assert.equal(typeof ct, 'function')
})
