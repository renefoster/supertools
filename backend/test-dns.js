import test from 'node:test'
import assert from 'node:assert/strict'

function flattenTxt(records) { return records.map((parts) => parts.join('')) }
function unique(values) { return [...new Set(values)] }

test('flattens TXT chunks', () => assert.deepEqual(flattenTxt([['v=spf1 ', 'a'], ['hello']]), ['v=spf1 a', 'hello']))
test('deduplicates resolved addresses', () => assert.deepEqual(unique(['1.1.1.1', '1.1.1.1', '::1']), ['1.1.1.1', '::1']))
