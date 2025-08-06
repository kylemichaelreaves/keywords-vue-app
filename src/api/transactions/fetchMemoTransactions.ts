import type { Memo, Transaction } from '@types'
import { httpClient } from '@api/httpClient'

// fetch a memo's transactions by its name
export async function fetchMemoTransactions(memoName: Memo['name']): Promise<Transaction[]> {
  try {
    const res = await httpClient.get(`/transactions`, {
      params: {
        memo: memoName
      }
    })
    return res.data
  } catch (err) {
    console.error('Error fetching memo transactions:', { memoName }, err)
    throw err
  }
}