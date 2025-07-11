import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'


const lastMonthStart = DateTime.now().minus({ months: 1 }).startOf('month').toJSDate()
const lastMonthEnd = DateTime.now().minus({ days: DateTime.now().day }).toJSDate()

export function generateDailyIntervals(
  count: number,
  startDate = lastMonthStart,
  endDate = lastMonthEnd
): {
  date: string,
  total_amount_debit: number
}[] {
  // Generate all the random dates first
  const dates = Array.from({ length: count }, () =>
    faker.date.between({ from: startDate, to: endDate })
  );

  // Sort dates in descending order (most recent first)
  dates.sort((a, b) => b.getTime() - a.getTime());

  // Create transaction objects with sorted dates
  return dates.map(date => ({
    date: date.toISOString(),
    total_amount_debit: -Math.abs(faker.number.float({ min: 1, max: 1000, fractionDigits: 2 }))
  }));
}