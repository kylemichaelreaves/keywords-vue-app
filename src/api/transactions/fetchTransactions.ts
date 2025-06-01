import { httpClient } from '@api/httpClient'
import type { Memo, TransactionQueryParams } from '@types'

export async function fetchTransactions(queryParams: TransactionQueryParams): Promise<Array<Memo>> {

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

  console.log('Filtered Query Params:', filteredQueryParams)

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

