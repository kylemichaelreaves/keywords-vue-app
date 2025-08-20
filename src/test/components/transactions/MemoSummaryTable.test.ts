import { mount, VueWrapper } from '@vue/test-utils'
import MemoSummaryTable from '@components/transactions/MemoSummaryTable.vue'
import { ElCard, ElStatistic, ElSkeleton } from 'element-plus'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createTestingPinia } from '@pinia/testing'
import { useTransactionsStore } from '@stores/transactions'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

// Mock the useMemoSummary hook
vi.mock('@api/hooks/transactions/useMemoSummary', () => ({
  default: () => ({
    data: {
      sum_amount_debit: -300.50,
      transactions_count: 5
    },
    isFetching: false,
    isLoading: false,
    isError: false,
    error: null
  })
}))

// Mock the Vue Router useRoute composable
vi.mock('vue-router', () => ({
  useRoute: () => ({
    params: {
      memoName: 'Test Memo'
    }
  })
}))

describe('MemoSummaryTable.vue', () => {
  let wrapper: VueWrapper<any>

  beforeEach(() => {
    wrapper = mount(MemoSummaryTable, {
      global: {
        components: {
          ElStatistic,
          ElCard,
          ElSkeleton
        },
        plugins: [
          VueQueryPlugin,
          createTestingPinia({
            initialState: {
              transactions: {
                selectedMonth: '',
                selectedWeek: '',
                selectedDay: '',
                selectedMemo: ''
              }
            },
            stubActions: false
          })
        ],
        stubs: {
          'router-link': true,
          'MemoBudgetCategory': true,
          'MemoTransactionsTable': true,
          'BackButton': true,
          'AlertComponent': true
        }
      }
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.clearAllTimers()
    if (wrapper) {
      wrapper.unmount()
    }
  })

  test('renders the MemoSummaryTable with the correct fields', async () => {
    const store = useTransactionsStore()

    store.selectedMemo = 'Memo: Test'
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

    // Check if the correct statistics are rendered
    expect(statistics[0].props('title')).toBe('Total Amount Debit')
    expect(statistics[0].props('value')).toBe(-300.50)
    expect(statistics[1].props('title')).toBe('Transactions Count')
    expect(statistics[1].props('value')).toBe(5)

    // Check if the summary stats container exists
    const summaryStats = wrapper.find('[data-testid="memo-summary-stats"]')
    expect(summaryStats.exists()).toBe(true)
  })
})
