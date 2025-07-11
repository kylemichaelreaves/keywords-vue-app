import type { Memo, MemoSummary } from '@types'
import { httpClient } from '@api/httpClient'


export async function fetchMemoSummary(memoName: Memo['name']): Promise<MemoSummary> {
  return await httpClient
    .get(`/memos/${memoName}/summary`)
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })

}