import { httpClient } from '@api/httpClient'
import type { Memo, TimeframeType } from '@types'

export async function fetchTransactions(queryParams: {
  date: Date;
  offset: number;
  limit: number;
  memo: Memo['name'];
  timeFrame: TimeframeType
  oldestDate?: boolean;
  count?: boolean;
}) {

  const { date, offset, limit, memo, timeFrame, oldestDate, count } = queryParams


  return await httpClient
    .get(`/transactions`, {
      params: {
        date: date ? date : undefined,
        offset: offset ? offset : undefined,
        limit: limit ? limit : undefined,
        memo: memo ? memo : undefined,
        timeFrame: timeFrame ? timeFrame : undefined,
        oldestDate: oldestDate ? oldestDate : undefined,
        count: count ? count : undefined
      }
    })
    .then((res) => res.data)
    .catch((err: Error) => {
      console.error('err:', err)
    })
}
