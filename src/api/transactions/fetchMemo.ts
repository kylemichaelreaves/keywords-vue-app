import type { Memo } from '@types'
import { httpClient } from '@api/httpClient'

export async function fetchMemo(memoName: Memo['name']): Promise<Memo[]> {
  try {
    const response = await httpClient.get(`/memos/${memoName}`)
    return response.data
  } catch (err) {
    console.error('Error fetching memo:', err)
    throw err
  }
}
