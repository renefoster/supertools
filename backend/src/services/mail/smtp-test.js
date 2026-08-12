import { command, connect, mxHosts, readResponse } from './smtp-transport.js'
import { AppError } from '../../utils/errors.js'

const SMTP_TEST_PORT = Number(process.env.SMTP_TEST_PORT || 25)

export async function run(target) {
  const host = (await mxHosts(target))[0]
  const socket = await connect(host, SMTP_TEST_PORT, SMTP_TEST_PORT === 465)
  try {
    const banner = await readResponse(socket)
    const ehlo = await command(socket, 'EHLO supertools.local')
    if (ehlo.code >= 400) throw new AppError(`SMTP EHLO rejected with ${ehlo.code}`, 'SMTP_EHLO_REJECTED', 422)
    await command(socket, 'QUIT').catch(() => {})
    return { host, port: SMTP_TEST_PORT, banner: banner.text, bannerCode: banner.code, ehlo: ehlo.text, ehloCode: ehlo.code, reachable: true, tested: true }
  } finally { socket.destroy() }
}
