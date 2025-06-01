import type { MJSummary } from '@types'
import { httpClient } from '@api/httpClient'


// TODO better way of handling null | Date | undefined?? if it's already optional?
export async function fetchMJAmountDebit(timeFrame: string, date?: string): Promise<MJSummary> {
  // TODO instead of a path, pass query params to transactions route, budgetCategory
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