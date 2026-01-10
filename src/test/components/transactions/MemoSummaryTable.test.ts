import { mount, VueWrapper } from '@vue/test-utils'
import MemoSummaryTable from '@components/memos/MemoSummaryTable.vue'
import { ElCard, ElStatistic, ElSkeleton } from 'element-plus'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createTestingPinia } from '@pinia/testing'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { ref } from 'vue'
import type { MemoSummary } from '@types'

// Define the component instance type
type MemoSummaryTableInstance = InstanceType<typeof MemoSummaryTable>


// Create controllable mock state
const mockMemoSummaryState = {
  data: ref({
    sum_amount_debit: -300.5,
    transactions_count: 5,
  } as MemoSummary | null),
  isFetching: ref(false),
  isLoading: ref(false),
  isError: ref(false),
  error: ref(null as { name: string; message: string } | null),
}

const mockMemoState = {
  data: ref({
    id: 1,
    name: 'Test Memo',
    description: 'Test Description',
  } as { id: number; name: string; description: string } | null),
  isFetching: ref(false),
  isLoading: ref(false),
  isError: ref(false),
  error: ref(null),
}

// Mock the useMemoSummary hook
vi.mock('@api/hooks/memos/useMemoSummary', () => ({
  default: () => mockMemoSummaryState,
}))

// Mock the useMemo hook
vi.mock('@api/hooks/memos/useMemo', () => ({
  default: () => mockMemoState,
}))

// Mock the Vue Router useRoute composable
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      memoId: '1',
    },
  }),
}))

// Mock child components
vi.mock('@components/memos/MemoTransactionsTable.vue', () => ({
  default: { template: '<div data-testid="memo-transactions-table"></div>' },
}))

vi.mock('@components/memos/MemoBudgetCategory.vue', () => ({
  default: { template: '<div data-testid="memo-budget-category"></div>' },
}))

vi.mock('@components/shared/BackButton.vue', () => ({
  default: { template: '<div data-testid="back-button"></div>' },
}))

vi.mock('@components/shared/AlertComponent.vue', () => ({
  default: { template: '<div data-testid="alert-component"></div>' },
}))

describe('MemoSummaryTable.vue', () => {
  let wrapper: VueWrapper<MemoSummaryTableInstance>

  beforeEach(() => {
    wrapper = mount(MemoSummaryTable, {
      global: {
        components: {
          ElStatistic,
          ElCard,
          ElSkeleton,
        },
        plugins: [
          VueQueryPlugin,
          createTestingPinia({
            initialState: {
              transactions: {
                selectedMonth: '',
                selectedWeek: '',
                selectedDay: '',
                selectedMemo: '',
              },
            },
            stubActions: false,
          }),
        ],
      },
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
    if (wrapper) {
      wrapper.unmount()
    }

    // Reset mock states to default
    mockMemoSummaryState.data.value = {
      sum_amount_debit: -300.5,
      transactions_count: 5,
    }
    mockMemoSummaryState.isFetching.value = false
    mockMemoSummaryState.isLoading.value = false
    mockMemoSummaryState.isError.value = false
    mockMemoSummaryState.error.value = null

    mockMemoState.data.value = {
      id: 1,
      name: 'Test Memo',
      description: 'Test Description',
    }
    mockMemoState.isFetching.value = false
    mockMemoState.isLoading.value = false
    mockMemoState.isError.value = false
    mockMemoState.error.value = null
  })

  test('renders the MemoSummaryTable with the correct fields', async () => {
    // Wait for the component to finish loading data
    await wrapper.vm.$nextTick()

    // Check if the card is rendered
    const card = wrapper.findComponent(ElCard)
    expect(card.exists()).toBe(true)

    // Check if the memo title is rendered
    const memoTitle = wrapper.find('[data-testid="memo-title"]')
    expect(memoTitle.exists()).toBe(true)
    expect(memoTitle.text()).toBe('Test Memo')

    // Check if the statistics are rendered
    const statistics = wrapper.findAllComponents(ElStatistic)
    expect(statistics.length).toBe(2)

    // Check if the correct statistics are rendered with proper null safety
    if (statistics.length >= 2) {
      expect(statistics[0]?.props('title')).toBe('Total Amount Debit')
      expect(statistics[0]?.props('value')).toBe(-300.5)
      expect(statistics[1]?.props('title')).toBe('Transactions Count')
      expect(statistics[1]?.props('value')).toBe(5)
    }

    // Check if the summary stats container exists
    const summaryStats = wrapper.find('[data-testid="memo-summary-stats"]')
    expect(summaryStats.exists()).toBe(true)
  })

  test('renders loading skeleton when data is loading', async () => {
    // Set mock states to loading
    mockMemoSummaryState.data.value = null
    mockMemoSummaryState.isLoading.value = true
    mockMemoSummaryState.isFetching.value = true

    mockMemoState.data.value = null
    mockMemoState.isLoading.value = true
    mockMemoState.isFetching.value = true

    const loadingWrapper = mount(MemoSummaryTable, {
      global: {
        components: {
          ElStatistic,
          ElCard,
          ElSkeleton,
        },
        plugins: [
          VueQueryPlugin,
          createTestingPinia({
            initialState: {
              transactions: {
                selectedMonth: '',
                selectedWeek: '',
                selectedDay: '',
                selectedMemo: '',
              },
            },
            stubActions: false,
          }),
        ],
      },
    })

    await loadingWrapper.vm.$nextTick()

    // Check if skeleton is rendered
    const skeleton = loadingWrapper.findComponent(ElSkeleton)
    expect(skeleton.exists()).toBe(true)

    loadingWrapper.unmount()
  })

  test('renders error state correctly', async () => {
    // Set mock states to error
    mockMemoSummaryState.data.value = null
    mockMemoSummaryState.isLoading.value = false
    mockMemoSummaryState.isFetching.value = false
    mockMemoSummaryState.isError.value = true
    mockMemoSummaryState.error.value = { name: 'Test Error', message: 'Test error message' }

    const errorWrapper = mount(MemoSummaryTable, {
      global: {
        components: {
          ElStatistic,
          ElCard,
          ElSkeleton,
        },
        plugins: [
          VueQueryPlugin,
          createTestingPinia({
            initialState: {
              transactions: {
                selectedMonth: '',
                selectedWeek: '',
                selectedDay: '',
                selectedMemo: '',
              },
            },
            stubActions: false,
          }),
        ],
      },
    })

    await errorWrapper.vm.$nextTick()

    // Check if alert component is rendered
    const alert = errorWrapper.find('[data-testid="memo-summary-error"]')
    expect(alert.exists()).toBe(true)

    errorWrapper.unmount()
  })
})
