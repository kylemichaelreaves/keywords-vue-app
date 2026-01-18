import type { MonthSummary } from '@types'
import { httpClient } from '@api/httpClient.ts'

export async function fetchMonthSummary(monthId: string): Promise<MonthSummary[]> {
  try {
    const response = await httpClient.get(`/transactions/months/${monthId}/summary`)
    return response.data
  } catch (err) {
    console.error('Error fetching month summary:', err)
    throw err
  }
}
