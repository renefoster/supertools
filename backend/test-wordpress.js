import test from 'node:test'
import assert from 'node:assert/strict'

import { run as version } from './src/services/wordpress/version.js'
import { run as php } from './src/services/wordpress/php.js'
import { run as theme } from './src/services/wordpress/theme.js'
import { run as plugins } from './src/services/wordpress/plugins.js'

test('WordPress services export run function', () => {
  assert.equal(typeof version, 'function')
  assert.equal(typeof php, 'function')
  assert.equal(typeof theme, 'function')
  assert.equal(typeof plugins, 'function')
})
