import type { OFSummaryTypeBase } from '@types'
import { httpClient } from '@api/httpClient'

export async function fetchOFAmountDebit(timeFrame: string, date?: Date): Promise<OFSummaryTypeBase> {
  return await httpClient
    .get(`/transactions`, {
      params: {
        timeFrame: timeFrame,
        date: date,
        budgetCategory: 'of',
      }
    })
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })

}