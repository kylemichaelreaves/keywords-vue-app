import { mount, VueWrapper } from '@vue/test-utils'
import TableComponent from '@components//shared/TableComponent.vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createTestingPinia } from '@pinia/testing'
import type { TestingPinia } from '@pinia/testing'
import { useTransactionsStore } from '@stores/transactions'
import { vi, afterEach, beforeEach } from 'vitest'

describe('TableComponent', () => {
  let store: TestingPinia
  let wrapper: VueWrapper
  let transactionsStore: ReturnType<typeof useTransactionsStore>

  beforeEach(() => {
    store = createTestingPinia({
      initialState: {
        transactions: {
          currentPage: 1,
          pageSize: 10,
        },
      },
    })
    transactionsStore = useTransactionsStore(store)

    const mockData: Record<string, string>[] = Array.from({ length: 101 }, (_, i) => ({
      column1: `row-${i}`,
    }))

    wrapper = mount(TableComponent, {
      props: {
        tableData: mockData,
        columns: [{ prop: 'column1', label: 'Column 1' }],
        sortableColumns: ['column1'],
        isFetching: false,
      },
      global: {
        plugins: [VueQueryPlugin, store],
      },
    })
  })

  afterEach(() => {
    vi.resetAllMocks()

    transactionsStore.transactionsPageSize = 10
    transactionsStore.transactionsCurrentPage = 1
  })

  it('renders table with correct data when provided', async () => {
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'ElTable' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ElTableColumn' }).exists()).toBe(true)
  })

  it('renders pagination when data exceeds page size', async () => {
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'ElPagination' }).exists()).toBe(true)
  })

  it('does not render pagination when data fits in one page', async () => {
    const smallWrapper = mount(TableComponent, {
      props: {
        tableData: [{ column1: 'only-row' }],
        columns: [{ prop: 'column1', label: 'Column 1' }],
        sortableColumns: [],
        isFetching: false,
      },
      global: {
        plugins: [VueQueryPlugin, store],
      },
    })

    await smallWrapper.vm.$nextTick()

    expect(smallWrapper.findComponent({ name: 'ElPagination' }).exists()).toBe(false)

    smallWrapper.unmount()
  })

  it('renders table with empty state when given an empty array', async () => {
    const emptyWrapper = mount(TableComponent, {
      props: {
        tableData: [],
        columns: [{ prop: 'column1', label: 'Column 1' }],
        sortableColumns: [],
        isFetching: false,
      },
      global: {
        plugins: [VueQueryPlugin, store],
      },
    })

    await emptyWrapper.vm.$nextTick()

    expect(emptyWrapper.findComponent({ name: 'ElTable' }).exists()).toBe(true)
    expect(emptyWrapper.findComponent({ name: 'ElPagination' }).exists()).toBe(false)

    emptyWrapper.unmount()
  })
})
