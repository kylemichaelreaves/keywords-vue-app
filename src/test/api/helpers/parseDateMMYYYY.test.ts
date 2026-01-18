import { describe, it, expect } from 'vitest'
import { parseDateMMYYYY } from '@api/helpers/parseDateMMYYYY'

describe('parseDateMMYYYY', () => {
  it('parses valid MM/YYYY string into a Date object', () => {
    const result = parseDateMMYYYY('01-2023')
    expect(result).toBeInstanceOf(Date)
    expect(result).toEqual(new Date(Date.UTC(2023, 0, 1)))
  })

  it('returns null for invalid month values', () => {
    expect(parseDateMMYYYY('13/2023')).toBeNull()
    expect(parseDateMMYYYY('0/2023')).toBeNull()
  })

  it('returns null for invalid date formats', () => {
    expect(parseDateMMYYYY('2023-01')).toBeNull()
  })

  it('handles edge case months correctly', () => {
    expect(parseDateMMYYYY('01-2023')).toEqual(new Date(Date.UTC(2023, 0, 1)))
    expect(parseDateMMYYYY('12-2023')).toEqual(new Date(Date.UTC(2023, 11, 1)))
  })

  // Add more tests as necessary for thorough coverage
})
