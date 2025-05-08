import type { Memo } from '@types'
import { httpClient } from '@api/httpClient'

export async function updateMemo(
  memo: Partial<Memo> & { id: string | number }
): Promise<Memo> {
  if (!memo.id) {
    throw new Error('Memo ID is required for updates')
  }

  try {
    const response = await httpClient.patch(
      `/memos/${memo.id}`,
      memo
    )
    return response.data
  } catch (error) {
    console.error('Error updating memo:', error)
    throw error
  }
}