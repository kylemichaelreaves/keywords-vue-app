import { httpClient } from '@api/httpClient'
import type { Memo, TimeframeType } from '@types'

export async function fetchTransactions(queryParams: {
  date?: Date | null;
  offset?: number;
  limit?: number;
  memo?: Memo['name'];
  timeFrame?: TimeframeType;
  oldestDate?: boolean;
  count?: boolean;
}) {

  function isValidParam(key: string, value: unknown): boolean {
    if (value === undefined) return false
    if (key === 'memo' && value === '') return false
    return !(key === 'date' && (
      (typeof value === 'number' && isNaN(value)) ||
      (value instanceof Date && isNaN(value.getTime()))
    ))
  }

  const filteredQueryParams = Object.fromEntries(
    Object.entries(queryParams).filter(([key, value]) => isValidParam(key, value))
  )

  try {
    const response = await httpClient.get('/transactions', {
      params: filteredQueryParams
    })
    return response.data
  } catch (err) {
    console.error('Error fetching transactions:', err)
    throw err
  }
}

