import { DateTime } from 'luxon'
import { faker } from '@faker-js/faker'

/**
 * Generates a random date within the past specified number of months as ISO string
 * @param months - Number of months in the past to generate dates from (default: 1)
 * @param timezone - Timezone to use (default: 'uts')
 * @returns Random date as ISO string within the specified range
 */
export function generateRandomPastDate(months: number = 1, timezone: string = 'utc'): string {
  const now = DateTime.now().setZone(timezone);
  const startDate = now.minus({ months });

  const randomTimestamp = faker.date.between({
    from: startDate.toJSDate(),
    to: now.toJSDate()
  });

  return DateTime.fromJSDate(randomTimestamp).setZone(timezone).toISO() ?? '';
}
