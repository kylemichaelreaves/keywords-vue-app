import { mount, VueWrapper } from '@vue/test-utils'
import MemoSummaryTable from '@components/memos/MemoSummaryTable.vue'
import { ElStatistic, ElSkeleton, ElSwitch } from 'element-plus'
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
    ambiguous: false,
    recurring: true,
    necessary: false,
    budget_category: 'Groceries',
  } as Record<string, unknown> | null),
  isFetching: ref(false),
  isLoading: ref(false),
  isError: ref(false),
  error: ref(null),
  refetch: vi.fn(),
}

// Mock the useMemoSummary hook
vi.mock('@api/hooks/memos/useMemoSummary', () => ({
  default: () => mockMemoSummaryState,
}))

// Mock the useMemo hook
vi.mock('@api/hooks/memos/useMemo', () => ({
  default: () => mockMemoState,
}))

const mockMutate = vi.fn()

vi.mock('@api/hooks/memos/mutateMemo', () => ({
  default: () => ({ mutate: mockMutate }),
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
          ElSkeleton,
          ElSwitch,
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
      ambiguous: false,
      recurring: true,
      necessary: false,
      budget_category: 'Groceries',
    }
    mockMemoState.isFetching.value = false
    mockMemoState.isLoading.value = false
    mockMemoState.isError.value = false
    mockMemoState.error.value = null
  })

  test('renders the MemoSummaryTable with the correct fields', async () => {
    // Wait for the component to finish loading data
    await wrapper.vm.$nextTick()

    // Check if the summary card container is rendered
    const card = wrapper.find('[data-testid="memo-summary-card"]')
    expect(card.exists()).toBe(true)

    // Check if the memo title is rendered
    const memoTitle = wrapper.find('[data-testid="memo-title"]')
    expect(memoTitle.exists()).toBe(true)
    expect(memoTitle.text()).toBe('Test Memo')

    // Check if the statistics are rendered (3 stat cards)
    const statistics = wrapper.findAllComponents(ElStatistic)
    expect(statistics.length).toBe(3)

    expect(statistics[0]?.props('title')).toBe('Total Amount Debit')
    expect(statistics[0]?.props('value')).toBe(-300.5)
    expect(statistics[1]?.props('title')).toBe('Transactions Count')
    expect(statistics[1]?.props('value')).toBe(5)
    expect(statistics[2]?.props('title')).toBe('Budget Category')
    const budgetCategoryStat = wrapper.find('[data-testid="memo-budget-category-stat"]')
    expect(budgetCategoryStat.text()).toContain('Groceries')

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

  test('renders toggle switches reflecting memo data', async () => {
    await wrapper.vm.$nextTick()

    const ambiguousToggle = wrapper.find('[data-testid="memo-ambiguous-toggle"]')
    const recurringToggle = wrapper.find('[data-testid="memo-recurring-toggle"]')
    const necessaryToggle = wrapper.find('[data-testid="memo-necessary-toggle"]')

    expect(ambiguousToggle.exists()).toBe(true)
    expect(recurringToggle.exists()).toBe(true)
    expect(necessaryToggle.exists()).toBe(true)
  })

  test('calls mutate with correct payload when ambiguous toggle is clicked', async () => {
    await wrapper.vm.$nextTick()

    const toggle = wrapper.find('[data-testid="memo-ambiguous-toggle"]')
    await toggle.find('input').setValue(true)
    await wrapper.vm.$nextTick()

    expect(mockMutate).toHaveBeenCalledWith(
      { memo: { id: 1, name: 'Test Memo', ambiguous: true } },
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    )
  })

  test('calls mutate with correct payload when recurring toggle is clicked', async () => {
    await wrapper.vm.$nextTick()

    const toggle = wrapper.find('[data-testid="memo-recurring-toggle"]')
    await toggle.find('input').setValue(false)
    await wrapper.vm.$nextTick()

    expect(mockMutate).toHaveBeenCalledWith(
      { memo: { id: 1, name: 'Test Memo', recurring: false } },
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    )
  })

  test('calls mutate with correct payload when necessary toggle is clicked', async () => {
    await wrapper.vm.$nextTick()

    const toggle = wrapper.find('[data-testid="memo-necessary-toggle"]')
    await toggle.find('input').setValue(true)
    await wrapper.vm.$nextTick()

    expect(mockMutate).toHaveBeenCalledWith(
      { memo: { id: 1, name: 'Test Memo', necessary: true } },
      expect.objectContaining({ onSuccess: expect.any(Function), onError: expect.any(Function) }),
    )
  })
})
