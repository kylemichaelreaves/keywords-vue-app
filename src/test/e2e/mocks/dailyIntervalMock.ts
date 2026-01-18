import { faker } from '@faker-js/faker'
import { DateTime } from 'luxon'
import type { DailyInterval } from '@types'

const lastMonthStart = DateTime.now().minus({ months: 1 }).startOf('month').toJSDate()
const lastMonthEnd = DateTime.now().minus({ days: DateTime.now().day }).toJSDate()

export function generateDailyIntervals(
  count: number,
  startDate = lastMonthStart,
  endDate = lastMonthEnd,
): DailyInterval[] {
  // Generate all the random dates first
  const dates = Array.from({ length: count }, () =>
    faker.date.between({ from: startDate, to: endDate }),
  )

  // Sort dates in descending order (most recent first)
  dates.sort((a, b) => b.getTime() - a.getTime())

  // Create transaction objects with sorted dates
  return dates.map((date) => ({
    date: date, // Keep as Date object, not string
    total_amount_debit: -Math.abs(faker.number.float({ min: 1, max: 1000, fractionDigits: 2 })),
  }))
}

export const staticDailyIntervals: DailyInterval[] = [
  {
    date: new Date('2025-06-01T00:00:00.000Z'),
    total_amount_debit: -150.0,
  },
  {
    date: new Date('2025-06-02T00:00:00.000Z'),
    total_amount_debit: -200.0,
  },
  {
    date: new Date('2025-06-03T00:00:00.000Z'),
    total_amount_debit: -100.0,
  },
  {
    date: new Date('2025-06-04T00:00:00.000Z'),
    total_amount_debit: -50.0,
  },
  {
    date: new Date('2025-06-05T00:00:00.000Z'),
    total_amount_debit: -300.0,
  },
  {
    date: new Date('2025-06-06T00:00:00.000Z'),
    total_amount_debit: -75.0,
  },
  {
    date: new Date('2025-06-07T00:00:00.000Z'),
    total_amount_debit: -125.0,
  },
  {
    date: new Date('2025-06-08T00:00:00.000Z'),
    total_amount_debit: -180.0,
  },
  {
    date: new Date('2025-06-09T00:00:00.000Z'),
    total_amount_debit: -220.0,
  },
  {
    date: new Date('2025-06-10T00:00:00.000Z'),
    total_amount_debit: -95.0,
  },
  {
    date: new Date('2025-06-11T00:00:00.000Z'),
    total_amount_debit: -130.0,
  },
  {
    date: new Date('2025-06-12T00:00:00.000Z'),
    total_amount_debit: -160.0,
  },
  {
    date: new Date('2025-06-13T00:00:00.000Z'),
    total_amount_debit: -110.0,
  },
  {
    date: new Date('2025-06-14T00:00:00.000Z'),
    total_amount_debit: -140.0,
  },
  {
    date: new Date('2025-06-15T00:00:00.000Z'),
    total_amount_debit: -170.0,
  },
  {
    date: new Date('2025-06-16T00:00:00.000Z'),
    total_amount_debit: -190.0,
  },
  {
    date: new Date('2025-06-17T00:00:00.000Z'),
    total_amount_debit: -210.0,
  },
  {
    date: new Date('2025-06-18T00:00:00.000Z'),
    total_amount_debit: -130.0,
  },
  {
    date: new Date('2025-06-19T00:00:00.000Z'),
    total_amount_debit: -120.0,
  },
  {
    date: new Date('2025-06-20T00:00:00.000Z'),
    total_amount_debit: -160.0,
  },
  {
    date: new Date('2025-06-21T00:00:00.000Z'),
    total_amount_debit: -180.0,
  },
  {
    date: new Date('2025-06-22T00:00:00.000Z'),
    total_amount_debit: -200.0,
  },
  {
    date: new Date('2025-06-23T00:00:00.000Z'),
    total_amount_debit: -220.0,
  },
  {
    date: new Date('2025-06-24T00:00:00.000Z'),
    total_amount_debit: -240.0,
  },
  {
    date: new Date('2025-06-25T00:00:00.000Z'),
    total_amount_debit: -260.0,
  },
  {
    date: new Date('2025-06-26T00:00:00.000Z'),
    total_amount_debit: -280.0,
  },
  {
    date: new Date('2025-06-27T00:00:00.000Z'),
    total_amount_debit: -300.0,
  },
  {
    date: new Date('2025-06-28T00:00:00.000Z'),
    total_amount_debit: -320.0,
  },
  {
    date: new Date('2025-06-29T00:00:00.000Z'),
    total_amount_debit: -340.0,
  },
  {
    date: new Date('2025-06-30T00:00:00.000Z'),
    total_amount_debit: -360.0,
  },
]
  .reverse()
  .slice(0, 10) // Ensure we have exactly 30 entries
