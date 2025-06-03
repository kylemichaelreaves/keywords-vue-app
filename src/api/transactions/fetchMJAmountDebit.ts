import type { MJSummary } from '@types'
import { httpClient } from '@api/httpClient'


export async function fetchMJAmountDebit(timeFrame: string, date?: string | Date): Promise<MJSummary> {
  return await httpClient
    .get(`/transactions`, {
      params: {
        timeFrame: timeFrame,
        date: date,
        budgetCategory: 'mj',
      }
    })
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })

}