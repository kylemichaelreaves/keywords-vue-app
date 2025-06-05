import { fetchTransactions } from './fetchTransactions'
import type { Memo, TimeframeType } from '@types'

/**
 * Fetches the count of transactions based on optional filters
 * This is a wrapper around fetchTransactions with count: true
 */
export async function fetchTransactionsCount(params: {
  date?: string;
  memo?: Memo['name'];
  timeFrame?: TimeframeType;
  oldestDate?: boolean;
} = {}) {
  return fetchTransactions({
    ...params,
    count: true
  })
}