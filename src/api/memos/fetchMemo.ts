import type { Memo } from '@types'
import { httpClient } from '@api/httpClient.ts'

export async function fetchMemo(memoId: Memo['id']): Promise<Memo> {
  try {
    const response = await httpClient.get(`/memos/${memoId}`)
    return response.data
  } catch (err) {
    console.error('Error fetching memo:', err)
    throw err
  }
}
