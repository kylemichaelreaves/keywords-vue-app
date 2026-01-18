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

  it('should include memo name in API call when memo is selected', async () => {
    const mockFetchTransactions = vi.spyOn(fetchTransactionsModule, 'fetchTransactions')
    mockFetchTransactions.mockResolvedValue([
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

    mount(createTestComponent(), {
      global: {
        plugins: [[VueQueryPlugin, { queryClient }], pinia],
      },
    })

    const store = useTransactionsStore()

    // Wait for initial query to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Clear cache to ensure fetchTransactions is called with new memo
    store.clearTransactionsByOffset()

    // Set memo name (as if user selected it)
    store.setSelectedMemo('Coffee Shop')

    // Wait for query to execute with new memo
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Verify fetchTransactions was called at least twice (once initial, once with memo)
    expect(mockFetchTransactions.mock.calls.length).toBeGreaterThanOrEqual(2)

    // Check the last call which should have the memo
    const lastCallIndex = mockFetchTransactions.mock.calls.length - 1
    const callArgs = mockFetchTransactions.mock.calls[lastCallIndex]![0]
    expect(callArgs).toHaveProperty('memo', 'Coffee Shop')
    expect(callArgs).not.toHaveProperty('memoId')
  })

  it('should include memoId in API call when numeric ID is in store', async () => {
    const mockFetchTransactions = vi.spyOn(fetchTransactionsModule, 'fetchTransactions')
    mockFetchTransactions.mockResolvedValue([])

    mount(createTestComponent(), {
      global: {
        plugins: [[VueQueryPlugin, { queryClient }], pinia],
      },
    })

    const store = useTransactionsStore()

    // Wait for initial query to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Clear cache to ensure fetchTransactions is called with new memo
    store.clearTransactionsByOffset()

    // Set memo ID as string (as if loaded from URL)
    store.setSelectedMemo('101')

    // Wait for query to execute with new memo
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Verify fetchTransactions was called at least twice
    expect(mockFetchTransactions.mock.calls.length).toBeGreaterThanOrEqual(2)

    // Check the last call which should have the memoId
    const lastCallIndex = mockFetchTransactions.mock.calls.length - 1
    const callArgs = mockFetchTransactions.mock.calls[lastCallIndex]![0]
    expect(callArgs).toHaveProperty('memoId', 101)
    expect(callArgs).not.toHaveProperty('memo')
  })

  it('should not include memo parameters when no memo is selected', async () => {
    const mockFetchTransactions = vi.spyOn(fetchTransactionsModule, 'fetchTransactions')
    mockFetchTransactions.mockResolvedValue([])

    mount(createTestComponent(), {
      global: {
        plugins: [[VueQueryPlugin, { queryClient }], pinia],
      },
    })

    const store = useTransactionsStore()

    // Ensure memo is empty
    store.setSelectedMemo('')

    // Wait for query to execute
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Verify fetchTransactions was called without memo parameters
    expect(mockFetchTransactions).toHaveBeenCalled()
    const callArgs = mockFetchTransactions.mock.calls[0]![0]
    expect(callArgs).not.toHaveProperty('memo')
    expect(callArgs).not.toHaveProperty('memoId')
  })

  it('should refetch when memo selection changes', async () => {
    const mockFetchTransactions = vi.spyOn(fetchTransactionsModule, 'fetchTransactions')
    mockFetchTransactions.mockResolvedValue([])

    mount(createTestComponent(), {
      global: {
        plugins: [[VueQueryPlugin, { queryClient }], pinia],
      },
    })

    const store = useTransactionsStore()

    // Initial load with no memo
    await new Promise((resolve) => setTimeout(resolve, 100))
    const initialCallCount = mockFetchTransactions.mock.calls.length

    // Change memo selection
    store.setSelectedMemo('Coffee Shop')
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Should have triggered a refetch
    expect(mockFetchTransactions.mock.calls.length).toBeGreaterThan(initialCallCount)
  })

  it('should correctly identify numeric strings as memo IDs', async () => {
    const mockFetchTransactions = vi.spyOn(fetchTransactionsModule, 'fetchTransactions')
    mockFetchTransactions.mockResolvedValue([])

    mount(createTestComponent(), {
      global: {
        plugins: [[VueQueryPlugin, { queryClient }], pinia],
      },
    })

    const store = useTransactionsStore()

    // Test various numeric formats
    const testCases = [
      { input: '123', shouldUseMemoId: true, expectedId: 123 },
      { input: '0', shouldUseMemoId: true, expectedId: 0 },
      { input: '999999', shouldUseMemoId: true, expectedId: 999999 },
      { input: 'Coffee Shop', shouldUseMemoId: false },
      { input: 'Shop 123', shouldUseMemoId: false },
      { input: '123abc', shouldUseMemoId: false },
    ]

    for (const testCase of testCases) {
      mockFetchTransactions.mockClear()
      store.setSelectedMemo(testCase.input)
      await new Promise((resolve) => setTimeout(resolve, 100))

      const callArgs = mockFetchTransactions.mock.calls[0]![0]

      if (testCase.shouldUseMemoId) {
        expect(callArgs).toHaveProperty('memoId', testCase.expectedId)
        expect(callArgs).not.toHaveProperty('memo')
      } else {
        expect(callArgs).toHaveProperty('memo', testCase.input)
        expect(callArgs).not.toHaveProperty('memoId')
      }
    }
  })

  it('should preserve cache key uniqueness for different memos', async () => {
    const mockFetchTransactions = vi.spyOn(fetchTransactionsModule, 'fetchTransactions')
    mockFetchTransactions.mockResolvedValue([])

    mount(createTestComponent(), {
      global: {
        plugins: [[VueQueryPlugin, { queryClient }], pinia],
      },
    })

    const store = useTransactionsStore()

    // Select first memo
    store.setSelectedMemo('Coffee Shop')
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Select second memo
    store.setSelectedMemo('Gas Station')
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Should have triggered separate fetches (not using cache)
    expect(mockFetchTransactions.mock.calls.length).toBeGreaterThanOrEqual(2)

    // Verify different memo parameters were used
    const firstCall = mockFetchTransactions.mock.calls[0]![0]
    const secondCall = mockFetchTransactions.mock.calls[1]![0]

    expect(firstCall.memo).not.toBe(secondCall.memo)
  })

  it('should include memo parameter alongside other query parameters', async () => {
    const mockFetchTransactions = vi.spyOn(fetchTransactionsModule, 'fetchTransactions')
    mockFetchTransactions.mockResolvedValue([])

    mount(createTestComponent(), {
      global: {
        plugins: [[VueQueryPlugin, { queryClient }], pinia],
      },
    })

    const store = useTransactionsStore()

    // Wait for initial query to complete
    await new Promise((resolve) => setTimeout(resolve, 100))

    // Clear cache to ensure fetchTransactions is called with new memo
    store.clearTransactionsByOffset()

    store.setSelectedMemo('Coffee Shop')
    store.setTransactionsTableLimit(50)

    // Wait for query to execute with new memo
    await new Promise((resolve) => setTimeout(resolve, 200))

    // Check the last call which should have all parameters
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
