import { describe, it, expect } from 'vitest'
import { getWeekRange } from '@api/helpers/getWeekRange'
import { DateTime } from 'luxon'

describe('getWeekRange', () => {
  it('should return the correct start and end dates for a given week string', () => {
    // Use a known week for testing, for example, the 8th week of 2024
    const weekString = '08-2024'
    const result = getWeekRange(weekString)

    // Calculate expected start and end dates using Luxon for comparison
    const expectedStartDate = DateTime.fromObject(
      { weekYear: 2024, weekNumber: 8 },
      { zone: 'UTC' },
    )
      .startOf('week')
      .toFormat('cccc MMMM dd')
    const expectedEndDate = DateTime.fromObject({ weekYear: 2024, weekNumber: 8 }, { zone: 'UTC' })
      .endOf('week')
      .toFormat('cccc MMMM dd')

    expect(result.startDate).toEqual(expectedStartDate)
    expect(result.endDate).toEqual(expectedEndDate)
  })

  // Add more test cases as needed, for example, testing edge cases like the end of the year
  it('should handle the transition from one year to the next', () => {
    const weekString = '52-2023'
    const result = getWeekRange(weekString)

    const expectedStartDate = DateTime.fromObject(
      { weekYear: 2023, weekNumber: 52 },
      { zone: 'UTC' },
    )
      .startOf('week')
      .toFormat('cccc MMMM dd')
    const expectedEndDate = DateTime.fromObject({ weekYear: 2023, weekNumber: 52 }, { zone: 'UTC' })
      .endOf('week')
      .toFormat('cccc MMMM dd')

    expect(result.startDate).toEqual(expectedStartDate)
    expect(result.endDate).toEqual(expectedEndDate)
  })
})
