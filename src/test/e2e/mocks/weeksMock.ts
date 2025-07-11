// generate an array of weeks WW-YYYY where WW is the week number and YYYY is the year
// the week is the ISO week number, starting from 01-2025
// specify the years
import { DateTime } from 'luxon'

/**
 * Generates an array of objects representing ISO weeks for testing
 * @param {number} startYear - The starting year
 * @param {number} endYear - The ending year (inclusive)
 * @returns {Array} Array of objects with week property in WW-YYYY format
 */
export function generateWeeksArray(startYear=2021, endYear=DateTime.now().year) {
  const weeks = []

  for (let year = startYear; year <= endYear; year++) {
    // Start from January 1st of the current year
    let currentDate = DateTime.fromObject({ year, month: 1, day: 1 })

    // Find the first Monday of the year (start of first week)
    currentDate = currentDate.startOf('week')

    // Generate all weeks for this year
    while (currentDate.weekYear <= year) {
      const weekNum = currentDate.weekNumber.toString().padStart(2, '0')
      const weekYear = currentDate.weekYear

      weeks.push({
        week: `${weekNum}-${weekYear}`
      })

      // Move to next week
      currentDate = currentDate.plus({ weeks: 1 })
    }
  }

  return weeks
}