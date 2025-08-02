import { httpClient } from '@api/httpClient'

export async function fetchSumAmountDebitByDate(timeFrame: string, date: string, totalAmountDebit=true): Promise<Array<{ total_amount_debit: number }>> {
  return await httpClient
    .get(`/transactions`, {
      params: {
        timeFrame,
        date: date,
        totalAmountDebit
      }
    })
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })

}