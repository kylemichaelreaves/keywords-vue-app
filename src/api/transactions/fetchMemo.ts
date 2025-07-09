import type { Memo } from '@types'
import { httpClient } from '@api/httpClient'

export async function fetchMemo(memoName: Memo['name']): Promise<Memo> {
  return await httpClient.get(`/memos/${memoName}`)
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })

}
