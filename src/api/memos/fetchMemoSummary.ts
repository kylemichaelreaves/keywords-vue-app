import type { Memo, MemoSummary } from '@types'
import { httpClient } from '@api/httpClient.ts'

export async function fetchMemoSummary(memoId: Memo['id']): Promise<MemoSummary> {
  try {
    const response = await httpClient.get(`/memos/${memoId}/summary`)
    return response.data
  } catch (err) {
    console.error('Error fetching memo summary:', err)
    throw err
  }
}
