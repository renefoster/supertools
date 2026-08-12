export function readSocket(socket, { timeoutMs, maxBytes, timeoutCode, label }) {
  return new Promise((resolve, reject) => {
    let output = ''
    let settled = false
    const timer = setTimeout(() => {
      const error = new Error(`${label} timed out after ${timeoutMs}ms`)
      error.code = timeoutCode
      finish(error)
    }, timeoutMs)
    const finish = (error, value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      socket.destroy()
      error ? reject(error) : resolve(value)
    }
    socket.setEncoding('utf8')
    socket.on('data', (chunk) => {
      output += chunk
      if (Buffer.byteLength(output, 'utf8') >= maxBytes) finish(null, output.slice(0, maxBytes))
    })
    socket.on('end', () => finish(null, output))
    socket.on('error', (error) => finish(error))
    socket.on('close', () => finish(null, output))
  })
}
