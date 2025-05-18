import type { Transaction, Memo } from '@types'
import { httpClient } from '@api/httpClient'

// TODO remove this redundancy…shouldn't this be covered by fetchTransactions whose memo is Memo['name']?
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