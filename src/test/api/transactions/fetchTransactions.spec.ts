import { describe, expect, it, vi } from 'vitest'
import { fetchTransactions } from '@api/transactions/fetchTransactions'
import { transactionsMock } from '@mocks/transaction'

console.error = vi.fn()

describe('fetchTransactions', () => {
  afterAll(() => {
    vi.resetAllMocks()
  })

  it('should fetch transactions with valid parameters', async () => {
    const queryParms = {
      date: undefined,
      offset: undefined,
      limit: undefined,
      memo: '',
      timeFrame: undefined,
      oldestDate: undefined,
      count: undefined,
    }

    const transactions = await fetchTransactions(queryParms)

    expect(transactions).toEqual(transactionsMock)
  })
})
