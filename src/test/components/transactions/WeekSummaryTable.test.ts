import { mount } from '@vue/test-utils'
import WeekSummaryTable from '@components/transactions/summaries/week/WeekSummaryTable.vue'
import { ElCard, ElStatistic, ElTable, ElTableColumn } from 'element-plus'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createTestingPinia } from '@pinia/testing'
import { useTransactionsStore } from '@stores/transactions'
import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest'
import { ref } from 'vue'

// Mock the router
vi.mock('@router', () => ({
  router: {
    push: vi.fn(),
  },
}))


// Mock the hooks
const mockUseWeekSummary = vi.fn()
vi.mock('@api/hooks/timeUnits/weeks/useWeekSummary.ts', () => ({
  default: () => mockUseWeekSummary(),
}))

vi.mock('@api/hooks/budgetCategories/useBudgetCategorySummary.ts', () => ({
  useBudgetCategorySummary: () => ({
    data: ref([
      { id: 1, name: 'Food', color: '#ff0000' },
      { id: 2, name: 'Transport', color: '#00ff00' },
    ]),
  }),
}))

vi.mock('@composables/useBudgetCategoryColors', () => ({
  useBudgetCategoryColors: () => ({
    getColorByName: vi.fn().mockReturnValue('#cccccc'),
    getColorById: vi.fn().mockReturnValue('#cccccc'),
  }),
}))

// Mock child components
vi.mock('@components/shared/AlertComponent.vue', () => ({
  default: { template: '<div data-testid="alert-component"></div>' },
}))

vi.mock('@components/transactions/summaries/week/WeekSummaryHeader.vue', () => ({
  default: { template: '<div data-testid="week-summary-header"></div>' },
}))

vi.mock('@components/memos/MemoEditModal.vue', () => ({
  default: {
    template: '<div data-testid="memo-edit-modal"></div>',
    methods: {
      openModal: vi.fn(),
    },
  },
}))

vi.mock('@components/shared/TableSkeleton.vue', () => ({
  default: { template: '<div data-testid="table-skeleton"></div>' },
}))

vi.mock('@components/transactions/summaries/BudgetCategorySummaries.vue', () => ({
  default: { template: '<div data-testid="budget-category-summaries"></div>' },
}))

describe('WeekSummaryTable', () => {
  let store: ReturnType<typeof useTransactionsStore>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
  })

  test('renders the WeekSummaryTable with the correct fields', async () => {
    // Mock successful data loading
    mockUseWeekSummary.mockReturnValue({
      data: ref([
        { memo: 'Test Memo 1', total_amount_debit: 100.5, budget_category: 'Food', category_id: 1 },
        {
          memo: 'Test Memo 2',
          total_amount_debit: 250.75,
          budget_category: 'Transport',
          category_id: 2,
        },
      ]),
      isError: ref(false),
      refetch: vi.fn(),
      isFetching: ref(false),
      isLoading: ref(false),
      isRefetching: ref(false),
      error: ref(null),
    })

    const wrapper = mount(WeekSummaryTable, {
      global: {
        components: {
          ElTable,
          ElStatistic,
          ElTableColumn,
          ElCard,
        },
        plugins: [
          VueQueryPlugin,
          createTestingPinia({
            initialState: {
              transactions: {
                selectedWeek: '01-2023',
                weeks: [{ week_year: '01-2023' }, { week_year: '02-2023' }],
              },
            },
            stubActions: false,
          }),
        ],
      },
    })

    store = useTransactionsStore()
    store.setSelectedWeek('01-2023')

    // Wait for the component to finish loading data
    await wrapper.vm.$nextTick()

    const table = wrapper.find('[data-testid="week-summary-table"]')

    // Check if the table is rendered
    expect(table.exists()).toBe(true)

    // Check if the correct number of columns is rendered (3 columns: memo, amount, budget_category)
    const columns = table.findAllComponents(ElTableColumn)
    expect(columns.length).toBe(3)

    // Check columns exist with proper null safety
    expect(columns.length).toBeGreaterThan(0)
    if (columns.length >= 3) {
      expect(columns[0]?.props('label')).toBe('Memo')
      expect(columns[1]?.props('label')).toBe('Weekly Amount Debit')
      expect(columns[2]?.props('label')).toBe('Budget Category')
    }

    // Check if the component renders the mocked data
    const tableComponent = wrapper.findComponent(ElTable)
    const tableData = tableComponent.props('data')
    expect(tableData).toHaveLength(2)

    if (tableData && Array.isArray(tableData)) {
      expect(tableData[0].memo).toBe('Test Memo 1')
      expect(tableData[0].total_amount_debit).toBe(100.5)
      expect(tableData[1].memo).toBe('Test Memo 2')
      expect(tableData[1].total_amount_debit).toBe(250.75)
    }
  })

  test('renders loading skeleton when data is loading', async () => {
    // Mock loading state
    mockUseWeekSummary.mockReturnValue({
      data: ref(null),
      isError: ref(false),
      refetch: vi.fn(),
      isFetching: ref(true),
      isLoading: ref(true),
      isRefetching: ref(false),
      error: ref(null),
    })

    const wrapper = mount(WeekSummaryTable, {
      global: {
        components: {
          ElTable,
          ElStatistic,
          ElTableColumn,
          ElCard,
        },
        plugins: [
          VueQueryPlugin,
          createTestingPinia({
            initialState: {
              transactions: {
                selectedWeek: '01-2023',
                weeks: [],
              },
            },
            stubActions: false,
          }),
        ],
      },
    })

    await wrapper.vm.$nextTick()

    const skeleton = wrapper.find('[data-testid="week-summary-table-skeleton"]')
    expect(skeleton.exists()).toBe(true)
  })

  test('handles error state correctly', async () => {
    // Mock error state
    mockUseWeekSummary.mockReturnValue({
      data: ref(null),
      isError: ref(true),
      refetch: vi.fn(),
      isFetching: ref(false),
      isLoading: ref(false),
      isRefetching: ref(false),
      error: ref({ name: 'Test Error', message: 'Test error message' }),
    })

    const wrapper = mount(WeekSummaryTable, {
      global: {
        components: {
          ElTable,
          ElStatistic,
          ElTableColumn,
          ElCard,
        },
        plugins: [
          VueQueryPlugin,
          createTestingPinia({
            initialState: {
              transactions: {
                selectedWeek: '01-2023',
                weeks: [],
              },
            },
            stubActions: false,
          }),
        ],
      },
    })

    await wrapper.vm.$nextTick()

    const alert = wrapper.find('[data-testid="alert-component"]')
    expect(alert.exists()).toBe(true)
  })
})
