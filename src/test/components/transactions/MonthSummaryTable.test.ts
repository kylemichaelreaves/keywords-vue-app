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
    memo_id: 1,
    total_amount_debit: 100.5,
    budget_category: 'Food',
    budget_category_id: 1,
  },
  {
    memo: 'Test Memo 2',
    memo_id: 2,
    total_amount_debit: 250.75,
    budget_category: 'Transport',
    budget_category_id: 2,
  },
]

// Create refs that we can update in tests
const mockData = ref<typeof mockMonthSummaryData | null>(mockMonthSummaryData)
const mockIsError = ref(false)
const mockIsFetching = ref(false)
const mockIsLoading = ref(false)
const mockIsRefetching = ref(false)
const mockError = ref<{ name: string; message: string } | null>(null)

// Mock the hooks
vi.mock('@api/hooks/timeUnits/months/useMonthSummary', () => {
  return {
    default: () => {
      return {
        data: mockData,
        isError: mockIsError,
        refetch: vi.fn(),
        isFetching: mockIsFetching,
        isLoading: mockIsLoading,
        isRefetching: mockIsRefetching,
        error: mockError,
      }
    },
  }
})

vi.mock('@api/hooks/budgetCategories/useBudgetCategorySummary', () => ({
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

vi.mock('@components/transactions/summaries/BudgetCategorySummaries.vue', () => ({
  default: {
    name: 'BudgetCategorySummaries',
    template: '<div data-testid="budget-category-summaries"></div>',
    props: ['timeFrame', 'date'],
  },
}))

vi.mock('@components/transactions/helpers/getTimeframeTypeAndValue', () => ({
  getTimeframeTypeAndValue: () => ({
    timeFrame: 'month',
    selectedValue: '01/2023',
  }),
}))

// Mock child components
vi.mock('@components/shared/AlertComponent.vue', () => ({
  default: {
    name: 'AlertComponent',
    template: '<div v-bind="$attrs"><slot /></div>',
    props: ['message', 'type', 'title'],
    inheritAttrs: true,
  },
}))

vi.mock('@components/transactions/summaries/month/MonthSummaryHeader.vue', () => ({
  default: {
    name: 'MonthSummaryHeader',
    template: '<div data-testid="month-summary-header"></div>',
    props: [
      'selectedMonth',
      'isLastMonth',
      'isFirstMonth',
      'goToNextMonth',
      'goToPreviousMonth',
      'resetSelectedMonth',
    ],
  },
}))

vi.mock('@components/memos/MemoEditModal.vue', () => ({
  default: {
    name: 'MemoEditModal',
    template: '<div data-testid="memo-edit-modal"></div>',
    props: ['memoName'],
    methods: {
      openModal: vi.fn(),
    },
  },
}))

describe('MonthSummaryTable', () => {
  let store: ReturnType<typeof useTransactionsStore>

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset mock refs to initial state
    mockData.value = mockMonthSummaryData
    mockIsError.value = false
    mockIsFetching.value = false
    mockIsLoading.value = false
    mockIsRefetching.value = false
    mockError.value = null
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
    await wrapper.vm.$nextTick() // Extra tick for reactive updates

    const table = wrapper.findComponent(ElTable)
    const columns = wrapper.findAllComponents(ElTableColumn)

    // Check if the table is rendered
    expect(table.exists()).toBe(true)

    // Check if the correct number of columns is rendered (5 columns: memo, memo_id, total_amount_debit, category_id, budget_category)
    expect(columns.length).toBe(5)

    // Check columns exist with proper null safety
    if (columns.length >= 5) {
      expect(columns[0]?.props('label')).toBe('Memo')
      expect(columns[1]?.props('label')).toBe('Memo ID')
      expect(columns[2]?.props('label')).toBe('Total Amount Debit')
      expect(columns[3]?.props('label')).toBe('Category ID')
      expect(columns[4]?.props('label')).toBe('Budget Category')
    }

    // Check if the component renders the mocked data
    const tableData = table.props('data')
    expect(tableData).toHaveLength(2)

    if (tableData && Array.isArray(tableData)) {
      expect(tableData[0].memo).toBe('Test Memo 1')
      expect(tableData[0].memo_id).toBe(1)
      expect(tableData[0].total_amount_debit).toBe(100.5)
      expect(tableData[1].memo).toBe('Test Memo 2')
      expect(tableData[1].memo_id).toBe(2)
      expect(tableData[1].total_amount_debit).toBe(250.75)
    }
  })

  test('renders loading skeleton when data is loading', async () => {
    // Update mock refs to simulate loading state
    mockData.value = null
    mockIsError.value = false
    mockIsFetching.value = true
    mockIsLoading.value = true
    mockIsRefetching.value = false
    mockError.value = null

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
    // Update mock refs to simulate error state
    mockData.value = null
    mockIsError.value = true
    mockIsFetching.value = false
    mockIsLoading.value = false
    mockIsRefetching.value = false
    mockError.value = { name: 'Test Error', message: 'Test error message' }

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
    await wrapper.vm.$nextTick() // Extra tick for reactive updates

    const alert = wrapper.find('[data-testid="month-summary-table-error"]')
    expect(alert.exists()).toBe(true)
  })
})
