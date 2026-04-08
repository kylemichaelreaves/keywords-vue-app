import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { VueQueryPlugin, QueryClient } from '@tanstack/vue-query'
import { createPinia } from 'pinia'
import { defineComponent } from 'vue'
import useTransactions from '@api/hooks/transactions/useTransactions'
import { useTransactionsStore } from '@stores/transactions'
import * as fetchTransactionsModule from '@api/transactions/fetchTransactions'

// Mock the fetchTransactions module
vi.mock('@api/transactions/fetchTransactions', () => ({
  fetchTransactions: vi.fn(),
}))

// Mock getTimeframeTypeAndValue
vi.mock('@components/transactions/helpers/getTimeframeTypeAndValue.ts', () => ({
  getTimeframeTypeAndValue: vi.fn(() => ({
    timeFrame: 'year',
    selectedValue: { value: '2026' },
  })),
}))

describe('useTransactions with Memo Selection', () => {
  let queryClient: QueryClient
  let pinia: ReturnType<typeof createPinia>

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
          gcTime: 0,
        },
      },
    })
    pinia = createPinia()
    vi.clearAllMocks()
  })

  const createTestComponent = () => {
    return defineComponent({
      template: '<div>Test</div>',
      setup() {
        const result = useTransactions()
        return { result }
      },
    })
  }

  function setupTest(mockData: Record<string, unknown>[] = []) {
    const mockFn = vi.spyOn(fetchTransactionsModule, 'fetchTransactions')
    mockFn.mockResolvedValue(mockData)
    mount(createTestComponent(), {
      global: { plugins: [[VueQueryPlugin, { queryClient }], pinia] },
    })
    return { mockFetchTransactions: mockFn, store: useTransactionsStore() }
  }

  it('should include memo name in API call when memo is selected', async () => {
    const { mockFetchTransactions, store } = setupTest([
      {
        id: 1,
        transaction_number: 'TX001',
        date: '2026-01-01',
        description: 'Test transaction',
        memo: 'Coffee Shop',
        amount_debit: '-10.00',
        amount_credit: '0.00',
      },
    ])

    await vi.waitFor(() => expect(mockFetchTransactions).toHaveBeenCalled())

    store.setSelectedMemo('Coffee Shop')

    await vi.waitFor(() =>
      expect(mockFetchTransactions.mock.calls.length).toBeGreaterThanOrEqual(2),
    )

    // Check the last call which should have the memo
    const lastCallIndex = mockFetchTransactions.mock.calls.length - 1
    const callArgs = mockFetchTransactions.mock.calls[lastCallIndex]![0]
    expect(callArgs).toHaveProperty('memo', 'Coffee Shop')
    expect(callArgs).not.toHaveProperty('memoId')
  })

  it('should include memoId in API call when numeric ID is in store', async () => {
    const { mockFetchTransactions, store } = setupTest()

    await vi.waitFor(() => expect(mockFetchTransactions).toHaveBeenCalled())

    store.setSelectedMemo('101')

    await vi.waitFor(() =>
      expect(mockFetchTransactions.mock.calls.length).toBeGreaterThanOrEqual(2),
    )

    // Check the last call which should have the memoId
    const lastCallIndex = mockFetchTransactions.mock.calls.length - 1
    const callArgs = mockFetchTransactions.mock.calls[lastCallIndex]![0]
    expect(callArgs).toHaveProperty('memoId', 101)
    expect(callArgs).not.toHaveProperty('memo')
  })

  it('should not include memo parameters when no memo is selected', async () => {
    const { mockFetchTransactions, store } = setupTest()

    store.setSelectedMemo('')

    await vi.waitFor(() => expect(mockFetchTransactions).toHaveBeenCalled())
    const callArgs = mockFetchTransactions.mock.calls[0]![0]
    expect(callArgs).not.toHaveProperty('memo')
    expect(callArgs).not.toHaveProperty('memoId')
  })

  it('should refetch when memo selection changes', async () => {
    const { mockFetchTransactions, store } = setupTest()

    await vi.waitFor(() => expect(mockFetchTransactions).toHaveBeenCalled())
    const initialCallCount = mockFetchTransactions.mock.calls.length

    store.setSelectedMemo('Coffee Shop')

    await vi.waitFor(() =>
      expect(mockFetchTransactions.mock.calls.length).toBeGreaterThan(initialCallCount),
    )
  })

  it.each([
    { input: '123', expectedId: 123 },
    { input: '0', expectedId: 0 },
    { input: '999999', expectedId: 999999 },
  ])('should use memoId=$expectedId for numeric input "$input"', async ({ input, expectedId }) => {
    const { mockFetchTransactions, store } = setupTest()

    store.setSelectedMemo(input)
    await vi.waitFor(() =>
      expect(mockFetchTransactions.mock.calls.some((c) => c[0]?.memoId === expectedId)).toBe(true),
    )

    const matchingCall = mockFetchTransactions.mock.calls.find((c) => c[0]?.memoId === expectedId)
    expect(matchingCall).toBeDefined()
    expect(matchingCall![0]).not.toHaveProperty('memo')
  })

  it.each([{ input: 'Coffee Shop' }, { input: 'Shop 123' }, { input: '123abc' }])(
    'should use memo name for non-numeric input "$input"',
    async ({ input }) => {
      const { mockFetchTransactions, store } = setupTest()

      store.setSelectedMemo(input)
      await vi.waitFor(() =>
        expect(mockFetchTransactions.mock.calls.some((c) => c[0]?.memo === input)).toBe(true),
      )

      const matchingCall = mockFetchTransactions.mock.calls.find((c) => c[0]?.memo === input)
      expect(matchingCall).toBeDefined()
      expect(matchingCall![0]).not.toHaveProperty('memoId')
    },
  )

  it('should preserve cache key uniqueness for different memos', async () => {
    const { mockFetchTransactions, store } = setupTest()

    store.setSelectedMemo('Coffee Shop')
    await vi.waitFor(() => expect(mockFetchTransactions).toHaveBeenCalled())

    store.setSelectedMemo('Gas Station')
    await vi.waitFor(() =>
      expect(mockFetchTransactions.mock.calls.length).toBeGreaterThanOrEqual(2),
    )

    // Verify different memo parameters were used
    const firstCall = mockFetchTransactions.mock.calls[0]![0]
    const secondCall = mockFetchTransactions.mock.calls[1]![0]

    expect(firstCall.memo).not.toBe(secondCall.memo)
  })

  it('should include memo parameter alongside other query parameters', async () => {
    const { mockFetchTransactions, store } = setupTest()

    await vi.waitFor(() => expect(mockFetchTransactions).toHaveBeenCalled())

    store.setSelectedMemo('Coffee Shop')
    store.setTransactionsTableLimit(50)

    await vi.waitFor(() =>
      expect(mockFetchTransactions.mock.calls.length).toBeGreaterThanOrEqual(2),
    )
    const lastCallIndex = mockFetchTransactions.mock.calls.length - 1
    const callArgs = mockFetchTransactions.mock.calls[lastCallIndex]![0]

    // Verify all parameters are present
    expect(callArgs).toHaveProperty('memo', 'Coffee Shop')
    expect(callArgs).toHaveProperty('limit', 50)
    expect(callArgs).toHaveProperty('offset', 0)
    expect(callArgs).toHaveProperty('timeFrame')
    expect(callArgs).toHaveProperty('date')
  })
})
