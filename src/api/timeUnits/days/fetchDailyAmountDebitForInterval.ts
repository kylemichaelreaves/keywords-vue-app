import { httpClient } from '@api/httpClient.ts'
import type { DailyInterval } from '@types'

export async function fetchDailyAmountDebitForInterval(
  interval?: string,
  startDate?: string | null,
): Promise<DailyInterval[]> {
  try {
    const response = await httpClient.get<Array<DailyInterval>>(`/transactions`, {
      params: {
        dailyTotals: true,
        interval,
        date: startDate,
      },
    })
    return response.data
  } catch (err) {
    console.error('Error fetching daily amount debit for interval:', err)
    throw err
  }
}
