import { mount } from '@vue/test-utils'
import MonthSummaryTable from '@components/transactions/summaries/month/MonthSummaryTable.vue'
import {
  ElCard,
  ElForm,
  ElFormItem,
  ElIcon,
  ElStatistic,
  ElTable,
  ElTableColumn,
} from 'element-plus'
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

// Mock the month summary data with correct structure matching MonthSummary interface
const mockMonthSummaryData = [
  {
    memo: 'Test Memo 1',
    total_amount_debit: 100.5,
    budget_category: 'Food',
    category_id: 1,
  },
  {
    memo: 'Test Memo 2',
    total_amount_debit: 250.75,
    budget_category: 'Transport',
    category_id: 2,
  },
]

// Mock the hooks
vi.mock('@api/hooks/transactions/useMonthSummary', () => {
  return {
    default: () => {
      return {
        data: ref(mockMonthSummaryData),
        isError: ref(false),
        refetch: vi.fn(),
        isFetching: ref(false),
        isLoading: ref(false),
        isRefetching: ref(false),
        error: ref(null),
      }
    },
  }
})

vi.mock('@api/hooks/transactions/useBudgetCategorySummary', () => ({
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

vi.mock('@components/transactions/getTimeframeTypeAndValue', () => ({
  getTimeframeTypeAndValue: () => ({
    timeFrame: 'month',
    selectedValue: '01/2023',
  }),
}))

// Mock child components
vi.mock('@components/shared/AlertComponent.vue', () => ({
  default: { template: '<div data-testid="alert-component"></div>' },
}))

vi.mock('@components/transactions/MonthSummaryHeader.vue', () => ({
  default: { template: '<div data-testid="month-summary-header"></div>' },
}))

vi.mock('@components/transactions/MemoEditModal.vue', () => ({
  default: {
    template: '<div data-testid="memo-edit-modal"></div>',
    methods: {
      openModal: vi.fn(),
    },
  },
}))

vi.mock('@components/transactions/BudgetCategorySummaries.vue', () => ({
  default: { template: '<div data-testid="budget-category-summaries"></div>' },
}))

describe('MonthSummaryTable', () => {
  let store: ReturnType<typeof useTransactionsStore>

  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  test('renders the MonthSummaryTable with the correct fields', async () => {
    const wrapper = mount(MonthSummaryTable, {
      global: {
        components: {
          ElTable,
          ElStatistic,
          ElTableColumn,
          ElCard,
          ElForm,
          ElIcon,
          ElFormItem,
        },
        plugins: [
          VueQueryPlugin,
          createTestingPinia({
            initialState: {
              transactions: {
                selectedMonth: '01/2023',
                months: [{ month_year: '01/2023' }, { month_year: '02/2023' }],
              },
            },
            stubActions: false,
          }),
        ],
      },
    })

    store = useTransactionsStore()
    store.setSelectedMonth('01/2023')

    // Wait for the component to finish loading data
    await wrapper.vm.$nextTick()

    const table = wrapper.findComponent(ElTable)
    const columns = wrapper.findAllComponents(ElTableColumn)

    // Check if the table is rendered
    expect(table.exists()).toBe(true)

    // Check if the correct number of columns is rendered (3 columns: memo, total_amount_debit, budget_category)
    expect(columns.length).toBe(3)

    // Check columns exist with proper null safety
    if (columns.length >= 3) {
      expect(columns[0]?.props('label')).toBe('Memo')
      expect(columns[1]?.props('label')).toBe('Total Amount Debit')
      expect(columns[2]?.props('label')).toBe('Budget Category')
    }

    // Check if the component renders the mocked data
    const tableData = table.props('data')
    expect(tableData).toHaveLength(2)

    if (tableData && Array.isArray(tableData)) {
      expect(tableData[0].memo).toBe('Test Memo 1')
      expect(tableData[0].total_amount_debit).toBe(100.5)
      expect(tableData[1].memo).toBe('Test Memo 2')
      expect(tableData[1].total_amount_debit).toBe(250.75)
    }
  })

  test('renders loading skeleton when data is loading', async () => {
    // Create a new mock for loading state
    vi.doMock('@api/hooks/transactions/useMonthSummary', () => {
      return {
        default: () => ({
          data: ref(null),
          isError: ref(false),
          refetch: vi.fn(),
          isFetching: ref(true),
          isLoading: ref(true),
          isRefetching: ref(false),
          error: ref(null),
        }),
      }
    })

    const wrapper = mount(MonthSummaryTable, {
      global: {
        components: {
          ElTable,
          ElStatistic,
          ElTableColumn,
          ElCard,
          ElForm,
          ElIcon,
          ElFormItem,
        },
        plugins: [
          VueQueryPlugin,
          createTestingPinia({
            initialState: {
              transactions: {
                selectedMonth: '01/2023',
                months: [],
              },
            },
            stubActions: false,
          }),
        ],
      },
    })

    await wrapper.vm.$nextTick()

    // Check if skeleton elements are rendered
    const skeletons = wrapper.findAll('[data-testid^="month-summary-skeleton-"]')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  test('handles error state correctly', async () => {
    // Create a new mock for error state
    vi.doMock('@api/hooks/transactions/useMonthSummary', () => {
      return {
        default: () => ({
          data: ref(null),
          isError: ref(true),
          refetch: vi.fn(),
          isFetching: ref(false),
          isLoading: ref(false),
          isRefetching: ref(false),
          error: ref({ name: 'Test Error', message: 'Test error message' }),
        }),
      }
    })

    const wrapper = mount(MonthSummaryTable, {
      global: {
        components: {
          ElTable,
          ElStatistic,
          ElTableColumn,
          ElCard,
          ElForm,
          ElIcon,
          ElFormItem,
        },
        plugins: [
          VueQueryPlugin,
          createTestingPinia({
            initialState: {
              transactions: {
                selectedMonth: '01/2023',
                months: [],
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
