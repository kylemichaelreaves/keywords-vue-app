import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DateTime } from 'luxon'
import { faker } from '@faker-js/faker'
import { generateRandomPastDate } from '@api/helpers/generateRandomPastDate.ts'


describe('generateRandomPastDate', () => {
  // Mock the current time to make tests deterministic
  const FIXED_DATE = '2025-07-20T12:00:00.000Z'
  const mockNow = DateTime.fromISO(FIXED_DATE, { zone: 'utc' })

  beforeEach(() => {
    // Set a fixed system time for consistent testing
    vi.setSystemTime(new Date(FIXED_DATE))

    // Seed faker for reproducible results (optional)
    faker.seed(12345)
  })

  afterEach(() => {
    vi.useRealTimers()
    faker.seed() // Reset faker seed
  })

  describe('basic functionality', () => {
    it('should return a valid ISO string', () => {
      const result = generateRandomPastDate()

      // Test it's a valid ISO string
      expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/)

      // Test it can be parsed back to a DateTime
      const parsed = DateTime.fromISO(result)
      expect(parsed.isValid).toBe(true)
    })

    it('should generate dates within the past month by default', () => {
      const result = generateRandomPastDate()
      const resultDate = DateTime.fromISO(result)

      const now = DateTime.fromISO(FIXED_DATE, { zone: 'utc' })
      const oneMonthAgo = now.minus({ months: 1 })

      expect(resultDate.toMillis()).toBeGreaterThanOrEqual(oneMonthAgo.toMillis())
      expect(resultDate.toMillis()).toBeLessThanOrEqual(now.toMillis())
    })

    it('should generate dates within the specified number of past months', () => {
      const months = 3
      const result = generateRandomPastDate(months)
      const resultDate = DateTime.fromISO(result)

      const now = DateTime.fromISO(FIXED_DATE, { zone: 'utc' })
      const threeMonthsAgo = now.minus({ months })

      expect(resultDate.toMillis()).toBeGreaterThanOrEqual(threeMonthsAgo.toMillis())
      expect(resultDate.toMillis()).toBeLessThanOrEqual(now.toMillis())
    })
  })

  describe('timezone handling', () => {
    it('should handle UTC timezone correctly', () => {
      const result = generateRandomPastDate(1, 'utc')
      expect(result).toMatch(/Z$/) // UTC should end with Z
    })

    it('should handle custom timezones', () => {
      const result = generateRandomPastDate(1, 'America/New_York')
      const resultDate = DateTime.fromISO(result)

      expect(resultDate.isValid).toBe(true)
      // Eastern time should have offset
      expect(result).toMatch(/[+-]\d{2}:\d{2}$/)
    })

    it('should generate dates in the correct timezone range', () => {
      const timezone = 'Asia/Tokyo'
      const result = generateRandomPastDate(2, timezone)
      const resultDate = DateTime.fromISO(result)

      const now = DateTime.fromISO(FIXED_DATE).setZone(timezone)
      const twoMonthsAgo = now.minus({ months: 2 })

      // Convert result to the same timezone for comparison
      const resultInTimezone = resultDate.setZone(timezone)

      expect(resultInTimezone.toMillis()).toBeGreaterThanOrEqual(twoMonthsAgo.toMillis())
      expect(resultInTimezone.toMillis()).toBeLessThanOrEqual(now.toMillis())
    })
  })

  describe('edge cases', () => {
    it('should handle zero months (current month only)', () => {
      // Note: Your function doesn't explicitly handle 0, but let's test it
      const result = generateRandomPastDate(0)
      const resultDate = DateTime.fromISO(result)

      const now = DateTime.fromISO(FIXED_DATE, { zone: 'utc' })

      // Should be very close to now (within current moment)
      expect(resultDate.toMillis()).toBeLessThanOrEqual(now.toMillis())
    })

    it('should handle large month values', () => {
      const result = generateRandomPastDate(24) // 2 years
      const resultDate = DateTime.fromISO(result)

      const now = DateTime.fromISO(FIXED_DATE, { zone: 'utc' })
      const twoYearsAgo = now.minus({ months: 24 })

      expect(resultDate.toMillis()).toBeGreaterThanOrEqual(twoYearsAgo.toMillis())
      expect(resultDate.toMillis()).toBeLessThanOrEqual(now.toMillis())
    })

    it('should never return empty string for valid inputs', () => {
      const result = generateRandomPastDate(1)
      expect(result).not.toBe('')
      expect(result.length).toBeGreaterThan(0)
    })
  })

  describe('randomness and distribution', () => {
    it('should generate different dates on multiple calls', () => {
      const results = new Set()

      // Generate multiple dates
      for (let i = 0; i < 10; i++) {
        faker.seed(i) // Different seed each time
        results.add(generateRandomPastDate(1))
      }

      // Should have generated different dates (high probability)
      expect(results.size).toBeGreaterThan(1)
    })

    it('should distribute dates across the time range', () => {
      const dates: number[] = []
      const months = 6

      // Generate many dates
      for (let i = 0; i < 100; i++) {
        faker.seed(1000 + i)
        const result = generateRandomPastDate(months)
        const timestamp = DateTime.fromISO(result).toMillis()
        dates.push(timestamp)
      }

      const now = DateTime.fromISO(FIXED_DATE, { zone: 'utc' }).toMillis()
      const sixMonthsAgo = DateTime.fromISO(FIXED_DATE, { zone: 'utc' })
        .minus({ months }).toMillis()

      const min = Math.min(...dates)
      const max = Math.max(...dates)

      // Check distribution spans a good portion of the range
      const range = now - sixMonthsAgo
      const actualRange = max - min

      // Should cover at least 50% of the possible range
      expect(actualRange).toBeGreaterThan(range * 0.5)
    })
  })

  describe('parameter validation behavior', () => {
    it('should use default values when called without parameters', () => {
      const result = generateRandomPastDate()
      expect(result).toBeTruthy()
      expect(typeof result).toBe('string')
    })

    it('should handle decimal month values', () => {
      const result = generateRandomPastDate(1.5)
      const resultDate = DateTime.fromISO(result)

      expect(resultDate.isValid).toBe(true)
    })
  })
})

// Additional integration test
describe('generateRandomPastDate integration', () => {
  it('should work with real system time', () => {
    // Don't mock time for this test
    const result = generateRandomPastDate(1)
    const resultDate = DateTime.fromISO(result)

    const now = DateTime.now()
    const oneMonthAgo = now.minus({ months: 1 })

    expect(resultDate.isValid).toBe(true)
    expect(resultDate.toMillis()).toBeGreaterThanOrEqual(oneMonthAgo.toMillis())
    expect(resultDate.toMillis()).toBeLessThanOrEqual(now.toMillis())
  })
})

// Performance test (optional)
describe('generateRandomPastDate performance', () => {
  it('should generate dates quickly', () => {
    const start = performance.now()

    for (let i = 0; i < 1000; i++) {
      generateRandomPastDate(1)
    }

    const end = performance.now()
    const duration = end - start

    // Should complete 1000 generations in reasonable time (adjust as needed)
    expect(duration).toBeLessThan(1000) // 1 second
  })
})