import type { Memo, Transaction } from '@types'
import { httpClient } from '@api/httpClient.ts'
import { devConsole } from '@utils/devConsole'

export async function fetchMemoTransactions(memoId: Memo['id']): Promise<Transaction[]> {
  try {
    const res = await httpClient.get(`/transactions`, {
      params: {
        memoId: memoId,
      },
    })
    return res.data
  } catch (err) {
    devConsole('error', 'Error fetching memo transactions:', { memoId }, err)
    throw err
  }
}
