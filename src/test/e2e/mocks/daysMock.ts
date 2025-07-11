// generate an array of objects { day: '06-01-2025' }

import { DateTime } from 'luxon'

/**
 * Generates an array of objects representing days for testing
 * @param {number} startYear - The starting year
 * @param {number} endYear - The ending year (inclusive)
 * @returns {Array} Array of objects with day property in DD-MM-YYYY format
 */
export function generateDaysArray(startYear = 2021, endYear = DateTime.now().year) {
  const days = []

  // Start from January 1st of the start year
  let currentDate = DateTime.fromObject({ year: startYear, month: 1, day: 1 })

  // End on December 31st of the end year
  const endDate = DateTime.fromObject({ year: endYear, month: 12, day: 31 })

  while (currentDate <= endDate) {
    const dayNum = currentDate.day.toString().padStart(2, '0')
    const monthNum = currentDate.month.toString().padStart(2, '0')
    const year = currentDate.year

    days.push({
      day: `${dayNum}-${monthNum}-${year}`
    })

    // Move to next day
    currentDate = currentDate.plus({ days: 1 })
  }

  return days
}