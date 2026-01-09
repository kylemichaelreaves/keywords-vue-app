import { describe, expect, it, vi } from 'vitest'
// import { http, HttpResponse } - unused from 'msw'
import { fetchTransactions } from '@api/transactions/fetchTransactions'
import { transactionsMock } from '@mocks/transaction'
// import { server } - unused from '@test/test-setup'

console.error = vi.fn()

const API_BASE_URL = import.meta.env.VITE_APIGATEWAY_URL

describe('fetchTransactions', () => {
  beforeEach(() => {
    server.use(
      http.get(`${API_BASE_URL}/transactions`, ({ request }) => {
        console.log('request url:', request.url)
        return HttpResponse.json(transactionsMock)
      }),

      http.all('*', ({ request }) => {
        console.log('unmatched request:', request.method, request.url)
        return new HttpResponse('Unmatched request', { status: 500 })
      })
    )
  })

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
      count: undefined
    }

    const transactions = await fetchTransactions(queryParms)

    expect(transactions).toEqual(transactionsMock)
  })
})