import net from 'node:net'

const DEFAULT_HOST = '127.0.0.1'
const DEFAULT_PORT = 5432
const DEFAULT_TIMEOUT_MS = 1500

/**
 * Returns true if something accepts TCP connections on host:port (e.g. SSM-forwarded Postgres).
 */
export function checkTcpPortOpen(
  port: number = DEFAULT_PORT,
  host: string = DEFAULT_HOST,
  timeoutMs: number = DEFAULT_TIMEOUT_MS,
): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.createConnection({ port, host }, () => {
      socket.destroy()
      resolve(true)
    })
    socket.setTimeout(timeoutMs)
    socket.on('timeout', () => {
      socket.destroy()
      resolve(false)
    })
    socket.on('error', () => {
      resolve(false)
    })
  })
}

/**
 * Logs whether the local Postgres tunnel appears to be up. Skipped when
 * SKIP_POSTGRES_CHECK=true, or during Storybook. Set REQUIRE_POSTGRES_TUNNEL=true
 * to exit the process when the port is closed.
 */
export async function logLocalPostgresTunnelStatus(): Promise<void> {
  if (process.env.SKIP_POSTGRES_CHECK === 'true') {
    return
  }
  if (
    process.env.npm_lifecycle_event === 'storybook' ||
    process.env.SB_MODE === 'development'
  ) {
    return
  }

  const host = process.env.VITE_POSTGRES_TUNNEL_HOST ?? DEFAULT_HOST
  const port = Number.parseInt(process.env.VITE_POSTGRES_TUNNEL_PORT ?? String(DEFAULT_PORT), 10)
  const timeoutMs = Number.parseInt(
    process.env.VITE_POSTGRES_TUNNEL_TIMEOUT_MS ?? String(DEFAULT_TIMEOUT_MS),
    10,
  )

  const open = await checkTcpPortOpen(port, host, timeoutMs)

  if (open) {
    console.info(`[vite] Postgres tunnel OK (${host}:${port})`)
    return
  }

  const hint =
    'Start your SSM tunnel (or local Postgres) if the API needs the database. ' +
    'Set SKIP_POSTGRES_CHECK=true to silence this. ' +
    'Set REQUIRE_POSTGRES_TUNNEL=true to fail startup when the port is closed.'

  const message = `[vite] Postgres tunnel: nothing listening on ${host}:${port} — ${hint}`

  if (process.env.REQUIRE_POSTGRES_TUNNEL === 'true') {
    console.error(message)
    process.exit(1)
  }

  console.warn(message)
}
