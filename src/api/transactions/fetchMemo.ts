import type { Memo } from '@types'
import { httpClient } from '@api/httpClient'

export async function fetchMemo(memoId: Memo['id']): Promise<Memo> {
  return await httpClient.get(`/memos/${memoId}`)
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })

}
