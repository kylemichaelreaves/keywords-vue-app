import { fetchWeekSummary } from '@api/timeUnits/weeks/fetchWeekSummary.ts'
import { weekSummaryMock } from '@mocks/transaction'
import { describe, test, vi } from 'vitest'

describe('fetchWeekSummary', () => {
  afterEach(() => {
    vi.resetAllMocks()
  })

  test('fetchWeekSummary should fetch data correctly', async () => {
    const week = '52-2021'

    const result = await fetchWeekSummary(week)
    expect(result).toEqual(weekSummaryMock)
  })

  test.todo('fetchWeekSummary should throw an error if the request fails')
})
