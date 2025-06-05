import type { Memo, MemoQueryParams } from '@types'
import { httpClient } from '@api/httpClient'


export async function fetchMemos(queryParams: MemoQueryParams): Promise<Array<Memo>> {
  return await httpClient
    .get(`/memos`, {
      params: queryParams
    })
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })

}
