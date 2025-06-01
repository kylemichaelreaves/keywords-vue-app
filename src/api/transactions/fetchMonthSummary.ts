import type { MonthSummary } from '@types'
import { httpClient } from '@api/httpClient'

export async function fetchMonthSummary(monthId: string): Promise<MonthSummary[]> {
  return await httpClient
    .get(`/transactions/months/${monthId}/summary`)
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })

}