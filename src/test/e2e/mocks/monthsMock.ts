import { DateTime } from 'luxon'

/**
 * Generates an array of objects representing months for testing
 * @param {number} startYear - The starting year
 * @param {number} endYear - The ending year (inclusive)
 * @returns {Array} Array of objects with month property in MM-YYYY format, from oldest to most recent (up to previous month)
 */
export function generateMonthsArray(startYear = 2021, endYear = DateTime.now().year) {
  const months = []
  const now = DateTime.now()
  const currentYear = now.year
  const currentMonth = now.month

  for (let year = startYear; year <= endYear; year++) {
    const maxMonth = year === currentYear ? currentMonth - 1 : 12

    // Skip this year entirely if we're in January of the current year
    if (maxMonth <= 0) continue

    for (let month = 1; month <= maxMonth; month++) {
      const monthNum = month.toString().padStart(2, '0')
      months.push({
        month_year: `${monthNum}-${year}`,
      })
    }
  }

  // Return array from oldest to most recent (chronological order)
  return months.reverse()
}
