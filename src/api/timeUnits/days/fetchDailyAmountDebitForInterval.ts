import { httpClient } from '@api/httpClient.ts'
import type { DailyInterval } from '@types'

export async function fetchDailyAmountDebitForInterval(
  interval?: string,
  startDate?: string | null,
): Promise<DailyInterval[]> {
  try {
    const params = {
      dailyTotals: true,
      interval,
      date: startDate,
    }

    const response = await httpClient.get<Array<DailyInterval>>(`/transactions`, {
      params,
    })

    return response.data
  } catch (err) {
    console.error('[fetchDailyAmountDebitForInterval] Error:', err)
    throw err
  }
}
