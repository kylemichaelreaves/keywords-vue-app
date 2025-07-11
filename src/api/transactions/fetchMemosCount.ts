import { httpClient } from '@api/httpClient'

export async function fetchMemosCount(timeFrame?: string, date?: Date, distinct?: boolean, count=true): Promise<number> {
  return await httpClient
    .get(`/memos?count=true`, {
      params: {
        timeFrame: timeFrame,
        date: date,
        distinct: distinct,
      }
    })
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })
}