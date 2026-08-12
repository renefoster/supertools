import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeDomain } from './src/utils/domain.js'

test('normalizes valid domain', () => assert.equal(normalizeDomain(' Example.COM. '), 'example.com'))
test('rejects URL and IP', () => {
  assert.equal(normalizeDomain('https://example.com'), null)
  assert.equal(normalizeDomain('127.0.0.1'), null)
})
test('rejects malformed labels', () => {
  assert.equal(normalizeDomain('-bad.example'), null)
  assert.equal(normalizeDomain('bad..example'), null)
  assert.equal(normalizeDomain('bad domain.example'), null)
})
