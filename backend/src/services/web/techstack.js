import { request } from './request.js'

const SIGNALS = [
  ['WordPress', /wp-content|wp-includes|wordpress/i],
  ['React', /react(?:\.production)?\.min\.js|data-reactroot/i],
  ['Vue', /vue(?:\.min)?\.js|data-v-[a-f0-9]/i],
  ['jQuery', /jquery(?:\.min)?\.js/i],
  ['Bootstrap', /bootstrap(?:\.min)?\.(?:css|js)/i],
  ['Shopify', /cdn\.shopify\.com|shopify-section/i],
  ['Google Analytics', /googletagmanager\.com|google-analytics\.com/i]
]

export async function run(target, options = {}) {
  const response = await request(target)
  const html = await response.text()
  const detected = SIGNALS.filter(([, pattern]) => pattern.test(html)).map(([name]) => name)
  return { detected, count: detected.length, status: response.status }
}
