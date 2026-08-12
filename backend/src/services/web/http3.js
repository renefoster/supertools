export async function run(target, options = {}) {
  return {
    supported: false,
    reason: 'Node.js runtime does not provide a native HTTP/3 or QUIC client for passive verification.'
  }
}
