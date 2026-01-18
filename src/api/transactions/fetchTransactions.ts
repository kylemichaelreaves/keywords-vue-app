import { httpClient } from '@api/httpClient'
import type { TransactionQueryParams } from '@types'
import { isValidParam } from '@api/helpers/isValidParam'

export async function fetchTransactions(queryParams: TransactionQueryParams) {
  console.log('[fetchTransactions] Raw Query Params:', queryParams)

  const filteredQueryParams = Object.fromEntries(
    Object.entries(queryParams).filter(([key, value]) => isValidParam(key, value)),
  )

  console.log('[fetchTransactions] Filtered Query Params:', filteredQueryParams)

  try {
    const response = await httpClient.get('/transactions', {
      params: filteredQueryParams,
    })
    return response.data
  } catch (err) {
    console.error('Error fetching transactions:', err)
    throw err
  }
}
