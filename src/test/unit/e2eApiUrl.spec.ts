import { describe, expect, it } from 'vitest'
import { apiPathname, isExecuteApiUrl } from '@test/e2e/helpers/e2eApiUrl.ts'

describe('e2eApiUrl', () => {
  describe('apiPathname', () => {
    it('strips /api/v1 prefix', () => {
      expect(apiPathname(new URL('http://localhost:5173/api/v1/memos'))).toBe('/memos')
    })

    it('strips /api/gateway prefix', () => {
      expect(apiPathname(new URL('http://localhost:5173/api/gateway/transactions'))).toBe(
        '/transactions',
      )
    })

    it('maps bare /api/v1 to /', () => {
      expect(apiPathname(new URL('http://localhost:5173/api/v1'))).toBe('/')
    })

    it('maps bare /api/gateway to /', () => {
      expect(apiPathname(new URL('http://localhost:5173/api/gateway'))).toBe('/')
    })

    it('leaves non-proxy paths unchanged', () => {
      expect(apiPathname(new URL('http://localhost:5173/memos'))).toBe('/memos')
    })
  })

  describe('isExecuteApiUrl', () => {
    it('matches execute-api host regardless of path prefix', () => {
      expect(
        isExecuteApiUrl(new URL('https://x.execute-api.us-east-1.amazonaws.com/Prod/memos')),
      ).toBe(true)
    })

    it('matches localhost /api/v1/memos (Vite proxy base URL)', () => {
      expect(isExecuteApiUrl(new URL('http://localhost:5173/api/v1/memos?limit=20'))).toBe(true)
    })

    it('matches localhost /api/gateway/transactions (fallback proxy)', () => {
      expect(isExecuteApiUrl(new URL('http://localhost:5173/api/gateway/transactions'))).toBe(true)
    })

    it('matches localhost /memos without proxy prefix', () => {
      expect(isExecuteApiUrl(new URL('http://127.0.0.1:4173/memos'))).toBe(true)
    })

    it('rejects non-API page paths on localhost', () => {
      expect(isExecuteApiUrl(new URL('http://localhost:5173/budget-visualizer'))).toBe(false)
    })
  })
})
