import { DateTime } from 'luxon'

/**
 * Generates an array of objects representing ISO weeks for testing.
 * Stops at the last week starting in the previous month.
 * @param {number} startYear - The starting year
 * @param {number} endYear - The ending year (inclusive)
 * @returns {Array} Array of objects with week_year property in WW-YYYY format
 */
export function generateWeeksArray(startYear = 2021, endYear = DateTime.now().year) {
  const weeks = []

  // Find the last day of the previous month from today
  const today = DateTime.now()
  const prevMonth = today.minus({ months: 1 })
  const lastDayPrevMonth = prevMonth.endOf('month')

  for (let year = startYear; year <= endYear; year++) {
    // Start from the first day of the year
    let currentDate = DateTime.fromObject({ year, month: 1, day: 1 }).startOf('week')

    // Generate all weeks, but stop if the week starts after lastDayPrevMonth
    while (currentDate.weekYear <= year) {
      if (currentDate > lastDayPrevMonth) {
        break
      }

      const weekNum = currentDate.weekNumber.toString().padStart(2, '0')
      const weekYear = currentDate.weekYear

      weeks.push({
        week_year: `${weekNum}-${weekYear}`,
      })

      // Move to next week
      currentDate = currentDate.plus({ weeks: 1 })
    }
  }

  return weeks.reverse()
}
