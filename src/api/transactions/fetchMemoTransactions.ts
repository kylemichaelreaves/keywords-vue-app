import type { Memo, Transaction } from '@types'
import { httpClient } from '@api/httpClient'

// fetch a memo's transactions by its name
export async function fetchMemoTransactions(memoName: Memo['name']): Promise<Transaction> {
  return await httpClient
    .get(`/transactions`, {
      params: {
        memo: memoName
      }
    })
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
      throw err.message
    })

}