import { vi, test, describe, expect } from 'vitest'
import MonthSelect from '@components/transactions/selects/MonthSelect.vue'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { mount } from '@vue/test-utils'
import { createTestingPinia } from '@pinia/testing'
import { useTransactionsStore } from '@stores/transactions'
import { monthsMock } from '@mocks/transaction'

// Mock the useMonths hook
const mockUseMonths = vi.fn()
vi.mock('@api/hooks/transactions/useMonths', () => ({
  useMonths: () => mockUseMonths(),
}))

// Mock the router
const mockPush = vi.fn()
vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

describe('MonthSelect', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseMonths.mockReturnValue({
      data: { value: monthsMock },
      isFetching: false,
      isLoading: false,
      isError: false,
      error: null,
    })
  })

  const createWrapper = (storeState = {}) => {
    return mount(MonthSelect, {
      global: {
        plugins: [
          VueQueryPlugin,
          createTestingPinia({
            initialState: {
              transactions: {
                selectedMonth: '11/2022',
                ...storeState,
              },
            },
          }),
        ],
      },
    })
  }

  test('should render', () => {
    const wrapper = createWrapper()
    expect(wrapper.exists()).toBe(true)
  })

  test('should render with default data-testid', () => {
    const wrapper = createWrapper()
    expect(wrapper.find('[data-testid="transactions-table-month-select"]').exists()).toBe(true)
  })

  test('should render with custom data-testid', () => {
    const wrapper = mount(MonthSelect, {
      props: {
        dataTestId: 'custom-month-select',
      },
      global: {
        plugins: [
          VueQueryPlugin,
          createTestingPinia({
            initialState: {
              transactions: {
                selectedMonth: '11/2022',
              },
            },
          }),
        ],
      },
    })
    expect(wrapper.find('[data-testid="custom-month-select"]').exists()).toBe(true)
  })

  test('should render SelectComponent with correct props', () => {
    const wrapper = createWrapper()
    const selectComponent = wrapper.findComponent({ name: 'SelectComponent' })

    expect(selectComponent.exists()).toBe(true)
    expect(selectComponent.props('placeholder')).toBe('select a month')
    expect(selectComponent.props('selectedValue')).toBe('11/2022')
    expect(selectComponent.props('disabled')).toBe(false)
  })

  test('should show loading state', () => {
    mockUseMonths.mockReturnValue({
      data: { value: null },
      isFetching: true,
      isLoading: true,
      isError: false,
      error: null,
    })

    const wrapper = createWrapper()
    const selectComponent = wrapper.findComponent({ name: 'SelectComponent' })

    expect(selectComponent.props('disabled')).toBe(true)
  })

  test('should show error when API call fails', () => {
    const mockError = { name: 'API Error', message: 'Failed to fetch months' }
    mockUseMonths.mockReturnValue({
      data: { value: null },
      isFetching: false,
      isLoading: false,
      isError: true,
      error: mockError,
    })

    const wrapper = createWrapper()
    const alertComponent = wrapper.findComponent({ name: 'AlertComponent' })

    expect(alertComponent.exists()).toBe(true)
    expect(alertComponent.props('title')).toBe('API Error')
    expect(alertComponent.props('message')).toBe('Failed to fetch months')
    expect(alertComponent.props('type')).toBe('error')
  })

  test('should transform month data to options correctly', () => {
    const wrapper = createWrapper()
    const selectComponent = wrapper.findComponent({ name: 'SelectComponent' })

    const expectedOptions = monthsMock.map((item) => ({
      value: item.month_year,
      label: item.month_year,
    }))

    expect(selectComponent.props('options')).toEqual(expectedOptions)
  })

  test('should call store methods and navigate when month is selected', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
    })

    const wrapper = mount(MonthSelect, {
      global: {
        plugins: [VueQueryPlugin, pinia],
      },
    })

    const store = useTransactionsStore(pinia)
    const selectComponent = wrapper.findComponent({ name: 'SelectComponent' })

    // Simulate month selection
    await selectComponent.vm.$props.onChange('12/2022')

    expect(store.setTransactionsTableLimit).toHaveBeenCalledWith(200)
    expect(store.setSelectedMonth).toHaveBeenCalledWith('12/2022')
    expect(mockPush).toHaveBeenCalledWith('/budget-visualizer/transactions/months/12/2022/summary')
  })

  test('should clear selection and navigate when cleared', async () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
    })

    const wrapper = mount(MonthSelect, {
      global: {
        plugins: [VueQueryPlugin, pinia],
      },
    })

    const store = useTransactionsStore(pinia)
    const selectComponent = wrapper.findComponent({ name: 'SelectComponent' })

    // Simulate clearing selection
    await selectComponent.vm.$props.onClear()

    expect(store.setSelectedMonth).toHaveBeenCalledWith('')
    expect(mockPush).toHaveBeenCalledWith('/budget-visualizer/transactions')
  })

  test('should reset table limit on component unmount', () => {
    const pinia = createTestingPinia({
      createSpy: vi.fn,
      stubActions: false,
    })

    const wrapper = mount(MonthSelect, {
      global: {
        plugins: [VueQueryPlugin, pinia],
      },
    })

    const store = useTransactionsStore(pinia)

    // Unmount the component
    wrapper.unmount()

    expect(store.setTransactionsTableLimit).toHaveBeenCalledWith(100)
  })
})
