import { describe, expect, it } from 'vitest'
import { apiPathname, isExecuteApiUrl } from '@test/e2e/helpers/e2eApiUrl.ts'

describe('e2eApiUrl', () => {
  describe('apiPathname', () => {
    it('strips /api prefix', () => {
      expect(apiPathname(new URL('http://localhost:5173/api/memos'))).toBe('/memos')
    })

    it('maps bare /api to /', () => {
      expect(apiPathname(new URL('http://localhost:5173/api'))).toBe('/')
    })

    it('leaves non-proxy paths unchanged', () => {
      expect(apiPathname(new URL('http://localhost:5173/memos'))).toBe('/memos')
    })
  })

  describe('isExecuteApiUrl', () => {
    it('matches execute-api host regardless of path prefix', () => {
      expect(
        isExecuteApiUrl(new URL('https://x.execute-api.us-east-1.amazonaws.com/Stage/memos')),
      ).toBe(true)
    })

    it('matches localhost /api/memos (Vite proxy base URL)', () => {
      expect(isExecuteApiUrl(new URL('http://localhost:5173/api/memos?limit=20'))).toBe(true)
    })

    it('matches localhost /memos without /api', () => {
      expect(isExecuteApiUrl(new URL('http://127.0.0.1:4173/memos'))).toBe(true)
    })

    it('rejects non-API page paths on localhost', () => {
      expect(isExecuteApiUrl(new URL('http://localhost:5173/budget-visualizer'))).toBe(false)
    })
  })
})
