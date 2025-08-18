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

export const staticDailyIntervals = [
  {
    date: '2023-06-01T00:00:00.000Z',
    total_amount_debit: -150.00
  },
  {
    date: '2023-06-02T00:00:00.000Z',
    total_amount_debit: -200.00
  },
  {
    date: '2023-06-03T00:00:00.000Z',
    total_amount_debit: -100.00
  },
  {
    date: '2023-06-04T00:00:00.000Z',
    total_amount_debit: -50.00
  },
  {
    date: '2023-06-05T00:00:00.000Z',
    total_amount_debit: -300.00
  },
  {
    date: '2023-06-06T00:00:00.000Z',
    total_amount_debit: -75.00
  },
  {
    date: '2023-06-07T00:00:00.000Z',
    total_amount_debit: -125.00
  },
  {
    date: '2023-06-08T00:00:00.000Z',
    total_amount_debit: -180.00
  },
  {
    date: '2023-06-09T00:00:00.000Z',
    total_amount_debit: -220.00
  },
  {
    date: '2023-06-10T00:00:00.000Z',
    total_amount_debit: -95.00
  }
];
