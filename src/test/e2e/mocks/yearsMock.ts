import { DateTime } from 'luxon';
/**
 * Generates an array of objects representing years for testing
 * @param {number} startYear - The starting year
 * @param {number} endYear - The ending year (inclusive)
 * @returns {Array} Array of objects with year property in YYYY format
 */
export function generateYearsArray(startYear=2021, endYear=DateTime.now().year) {
  const years = [];

  for (let year = startYear; year <= endYear; year++) {
    years.push({
      year: year.toString()
    });
  }

  return years;
}
