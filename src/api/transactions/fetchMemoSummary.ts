import type { Memo, MemoSummary } from '@types'
import { httpClient } from '@api/httpClient'


export async function fetchMemoSummary(memoName: Memo['name']): Promise<MemoSummary> {
  try {
    const response = await httpClient.get(`/memos/${memoName}/summary`)
    return response.data
  } catch (err) {
    console.error('Error fetching memo summary:', err)
    throw err
  }
}