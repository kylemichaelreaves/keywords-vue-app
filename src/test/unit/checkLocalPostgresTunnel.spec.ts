/**
 * @vitest-environment node
 */
import net from 'node:net'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  checkTcpPortOpen,
  logLocalPostgresTunnelStatus,
} from '../../../scripts/checkLocalPostgresTunnel'

describe('checkLocalPostgresTunnel', () => {
  const savedEnv = { ...process.env }

  afterEach(() => {
    process.env = { ...savedEnv }
  })

  it('checkTcpPortOpen returns true when a server accepts the port', async () => {
    const server = net.createServer()
    await new Promise<void>((resolve) => server.listen(0, '127.0.0.1', resolve))
    const port = (server.address() as net.AddressInfo).port

    await expect(checkTcpPortOpen(port, '127.0.0.1', 2000)).resolves.toBe(true)

    await new Promise<void>((resolve, reject) => {
      server.close((err) => (err ? reject(err) : resolve()))
    })
  })

  it('checkTcpPortOpen returns false when nothing listens', async () => {
    await expect(checkTcpPortOpen(1, '127.0.0.1', 300)).resolves.toBe(false)
  })

  it('logLocalPostgresTunnelStatus skips when SKIP_POSTGRES_CHECK is set', async () => {
    process.env.SKIP_POSTGRES_CHECK = 'true'
    const info = vi.spyOn(console, 'info')
    const warn = vi.spyOn(console, 'warn')
    try {
      await logLocalPostgresTunnelStatus()
      expect(info).not.toHaveBeenCalled()
      expect(warn).not.toHaveBeenCalled()
    } finally {
      info.mockRestore()
      warn.mockRestore()
    }
  })
})
