import { describe, expect, it } from 'vitest'
import { safeRedirectPath } from '@utils/safeRedirectPath'

describe('safeRedirectPath', () => {
  it.each([
    ['/budget-visualizer/transactions', '/budget-visualizer/transactions'],
    ['/login?foo=bar', '/login?foo=bar'],
    ['/path#hash', '/path#hash'],
    ['  /trimmed  ', '/trimmed'],
  ])('returns a valid path for %j', (input, expected) => {
    expect(safeRedirectPath(input)).toBe(expected)
  })

  it.each([
    ['protocol-relative', '//evil.com/steal'],
    ['absolute url', 'https://evil.com'],
    ['javascript protocol', 'javascript:alert(1)'],
    ['JAVASCRIPT mixed case', 'JavaScript:alert(1)'],
    ['data uri', 'data:text/html,<script>alert(1)</script>'],
    ['empty string', ''],
    ['relative path', 'relative/path'],
  ])('returns undefined for unsafe input: %s', (_label, input) => {
    expect(safeRedirectPath(input)).toBeUndefined()
  })

  it.each([
    ['undefined', undefined],
    ['null', null],
    ['number', 42],
    ['boolean', true],
    ['object', { path: '/' }],
    ['array', ['/foo']],
  ])('returns undefined for non-string: %s', (_label, input) => {
    expect(safeRedirectPath(input)).toBeUndefined()
  })

  it('returns undefined when path exceeds max length', () => {
    const longPath = '/' + 'a'.repeat(2048)
    expect(safeRedirectPath(longPath)).toBeUndefined()
  })
})
