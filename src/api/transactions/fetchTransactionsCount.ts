import { fetchTransactions } from './fetchTransactions'
import type { Memo, Timeframe } from '@types'

/**
 * Fetches the count of transactions based on optional filters
 * This is a wrapper around fetchTransactions with count: true
 */
export async function fetchTransactionsCount(
  params: {
    date?: string
    memo?: Memo['name']
    timeFrame?: Timeframe
    oldestDate?: boolean
  } = {},
): Promise<{ count: number }[]> {
  return fetchTransactions({
    ...params,
    count: true,
  })
}
