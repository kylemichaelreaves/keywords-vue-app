import { parseDateIWIYYY } from '@api/helpers/parseDateIWIYYY'
import { parseDateMMYYYY } from '@api/helpers/parseDateMMYYYY'
import type { ComputedRef } from 'vue'

/**
 * Converts a date string to a Date object based on the specified date type format
 * @param dateType The type of date format ('week', 'month', 'day', 'year')
 * @param selectedValue The date value to convert
 * @returns A Date object or null if conversion failed
 */
export function getJSDateObject(
  dateType: string,
  selectedValue: string | ComputedRef<string> | null
): Date | null {
  if (!selectedValue) {
    return null
  }

  // Extract string value from ComputedRef if needed
  const value = typeof selectedValue === 'string'
    ? selectedValue
    : selectedValue.value

  try {
    switch (dateType) {
      case 'week':
        return parseDateIWIYYY(value)

      case 'month':
        return parseDateMMYYYY(value)

      case 'day':
        // Assuming value is in a format parseable by Date constructor
        // like YYYY-MM-DD or ISO string
        return new Date(value)

      case 'year':
        // Create a date for January 1st of the specified year
        return new Date(parseInt(value, 10), 0, 1)

      default:
        console.warn('Unknown dateType:', dateType)
        return null
    }
  } catch (error) {
    console.error(`Failed to parse date for type ${dateType}:`, error)
    return null
  }
}