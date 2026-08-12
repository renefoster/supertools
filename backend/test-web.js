import test from 'node:test'
import assert from 'node:assert/strict'

import { run as httpStatus } from './src/services/web/http-status.js'
import { run as redirectChain } from './src/services/web/redirect-chain.js'
import { run as ssl } from './src/services/web/ssl.js'
import { run as certificate } from './src/services/web/certificate.js'
import { run as securityHeaders } from './src/services/web/security-headers.js'
import { run as httpHeaders } from './src/services/web/http-headers.js'
import { run as compression } from './src/services/web/compression.js'
import { run as http2 } from './src/services/web/http2.js'
import { run as http3 } from './src/services/web/http3.js'
import { run as responseTime } from './src/services/web/response-time.js'
import { run as server } from './src/services/web/server.js'
import { run as cdn } from './src/services/web/cdn.js'
import { run as techstack } from './src/services/web/techstack.js'
import { run as whois } from './src/services/web/whois.js'

test('Web services export required run signature', () => {
  for (const service of [httpStatus, redirectChain, ssl, certificate, securityHeaders, httpHeaders, compression, http2, http3, responseTime, server, cdn, techstack, whois]) {
    assert.equal(typeof service, 'function')
    assert.ok(service.length >= 1)
  }
})

test('HTTP/3 reports explicit passive limitation', async () => {
  const result = await http3('example.com')
  assert.equal(result.supported, false)
  assert.match(result.reason, /HTTP\/3|QUIC/i)
})
