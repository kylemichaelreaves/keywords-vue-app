import { httpClient } from '@api/httpClient'
import type { Memo, TimeframeType } from '@types'

export async function fetchTransactions(queryParams: {
  date: Date | undefined;
  offset: number | undefined;
  limit: number | undefined;
  memo: Memo['name'] | undefined;
  timeFrame: TimeframeType | undefined;
  oldestDate?: boolean | undefined;
  count?: boolean | undefined;
}) {

  const { date, offset, limit, memo, timeFrame, oldestDate, count } = queryParams

  try {
    const response = await httpClient.get('/transactions', {
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
    return response.data
  } catch (err) {
    console.error('Error fetching transactions:', err)
    throw err
  }
}

