import { test } from 'vitest'
import getIsoWeeksOfMonth from '@api/helpers/getIsoWeeksOfMonth'
import { Settings } from 'luxon'

Settings.defaultZone = 'UTC'

describe('getIsoWeeksOfMonth', () => {
  test('returns correct week numbers for a month with 4 weeks', () => {
    const result = getIsoWeeksOfMonth(2022, 2)
    expect(result).toEqual([5, 6, 7, 8, 9])
  })

  test('returns correct week numbers for a month with 5 weeks and for a month starting in the last week of the previous year', () => {
    const result = getIsoWeeksOfMonth(2023, 1)
    expect(result).toEqual([52, 1, 2, 3, 4, 5])
  })

  test('returns correct week numbers for a month ending in the first week of the next year', () => {
    const result = getIsoWeeksOfMonth(2022, 12)
    expect(result).toEqual([48, 49, 50, 51, 52])
  })

  test('returns an empty array for an invalid month', () => {
    const result = getIsoWeeksOfMonth(2022, 13)
    expect(result).toEqual([])
  })

  test('returns an empty array for an invalid year', () => {
    const result = getIsoWeeksOfMonth(-1, 1)
    expect(result).toEqual([])
  })
})
