import { command, connect, mxHosts, readResponse, upgradeToTls } from './smtp-transport.js'
import { AppError } from '../../utils/errors.js'

const SMTP_STARTTLS_PORT = Number(process.env.SMTP_STARTTLS_PORT || 587)

export async function run(target) {
  const host = (await mxHosts(target))[0]
  const socket = await connect(host, SMTP_STARTTLS_PORT)
  try {
    const banner = await readResponse(socket)
    const ehlo = await command(socket, 'EHLO supertools.local')
    const starttls = await command(socket, 'STARTTLS')
    if (starttls.code >= 400) throw new AppError(`STARTTLS rejected with ${starttls.code}`, 'STARTTLS_REJECTED', 422)
    const secure = await upgradeToTls(socket, host)
    return { host, port: SMTP_STARTTLS_PORT, banner: banner.text, ehlo: ehlo.text, response: starttls.text, protocol: secure.getProtocol(), cipher: secure.getCipher()?.name || null, authorized: secure.authorized }
  } finally { socket.destroy() }
}
