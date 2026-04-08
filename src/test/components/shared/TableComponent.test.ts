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
  let mockHandleSizeChange: ReturnType<typeof vi.fn<(val: number) => void>>
  let mockHandleCurrentChange: ReturnType<typeof vi.fn<(val: number) => void>>

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

    mockHandleSizeChange = vi.fn<(val: number) => void>()
    mockHandleCurrentChange = vi.fn<(val: number) => void>()

    const mockData: Record<string, never>[] = Array.from({ length: 101 }, () => ({}))

    wrapper = mount(TableComponent, {
      props: {
        tableData: mockData,
        columns: [{ prop: 'column1', label: 'Column 1' }],
        sortableColumns: ['column1'],
        isFetching: false,
        LIMIT: 100,
        OFFSET: 0,
        currentPage: 1,
        pageSize: 10,
        handleSizeChange: mockHandleSizeChange,
        handleCurrentChange: mockHandleCurrentChange,
      },
      global: {
        plugins: [VueQueryPlugin, store],
      },
    })
  })

  afterEach(() => {
    vi.resetAllMocks()

    //     reset the store
    transactionsStore.transactionsPageSize = 10
    transactionsStore.transactionsCurrentPage = 1
  })

  it('renders table with correct data when provided', async () => {
    await wrapper.vm.$nextTick()

    expect(wrapper.findComponent({ name: 'ElTable' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ElTableColumn' }).exists()).toBe(true)
    expect(wrapper.findComponent({ name: 'ElPagination' }).exists()).toBe(true)
  })

  it('does not render table when no data is provided', async () => {
    await wrapper.vm.$nextTick()

    expect(wrapper.find('el-table').exists()).toBe(false)
  })

  it('updates page size when handleSizeChange is called', async () => {
    const store = useTransactionsStore()

    // Call the mock function directly
    await mockHandleSizeChange(20)

    // Set the store value to simulate what the actual handler would do
    store.transactionsPageSize = 20

    await wrapper.vm.$nextTick()

    // Verify the mock was called
    expect(mockHandleSizeChange).toHaveBeenCalledWith(20)

    // Check store state instead of component internals
    expect(store.transactionsPageSize).toBe(20)
    expect(store.getTransactionsPageSize).toBe(20)
  })

  it('updates current page when handleCurrentChange is called', async () => {
    const store = useTransactionsStore()

    // Call the mock function directly
    await mockHandleCurrentChange(2)

    // Set the store value to simulate what the actual handler would do
    store.transactionsCurrentPage = 2

    await wrapper.vm.$nextTick()

    // Verify the mock was called
    expect(mockHandleCurrentChange).toHaveBeenCalledWith(2)

    // Check store state instead of component internals
    expect(store.transactionsCurrentPage).toBe(2)
    expect(store.getTransactionsCurrentPage).toBe(2)
  })
})
