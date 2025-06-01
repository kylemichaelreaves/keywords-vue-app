import { httpClient } from '@api/httpClient'

// todo refactor URL, use /memos, pass count as params
export async function fetchMemosCount(timeFrame?: string, date?: Date, distinct?: boolean, count?: boolean): Promise<number> {
  return await httpClient
    .get(`/memos`, {
      params: {
        timeFrame: timeFrame,
        date: date,
        distinct: distinct,
        count: count
      }
    })
    .then(res => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })
}