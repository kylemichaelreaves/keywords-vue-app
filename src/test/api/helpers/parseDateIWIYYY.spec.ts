import { test } from 'vitest'
import { parseDateIWIYYY } from '@api/helpers/parseDateIWIYYY'

describe('parseDateIWIYYY', () => {
  // Test valid input cases
  test.skip('parseDateIWIYYY should return the correct date for valid input', () => {
    expect(parseDateIWIYYY('01-2023')?.toISOString()).toEqual(new Date(2023, 0, 1).toISOString())
    expect(parseDateIWIYYY('02-2023')?.toISOString()).toEqual(new Date(2023, 0, 1).toISOString())
    expect(parseDateIWIYYY('52-2021')?.toISOString()).toEqual(new Date(2021, 11, 19).toISOString())
  })

  // Test invalid input cases
  test('parseDateIWIYYY should return null for invalid input format', () => {
    expect(parseDateIWIYYY('01/2023')).toBeNull()
    expect(parseDateIWIYYY('1-2023')).toBeNull()
    expect(parseDateIWIYYY('02-23')).toBeNull()
  })

  // Test out of range week numbers
  test('parseDateIWIYYY should return null for out of range week numbers', () => {
    expect(parseDateIWIYYY('00-2023')).toBeNull()
    expect(parseDateIWIYYY('54-2023')).toBeNull()
  })
})
