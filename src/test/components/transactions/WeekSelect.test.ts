import WeekSelect from '@components/transactions/selects/WeekSelect.vue'
import { createTestingPinia } from '@pinia/testing'
import type { TestingPinia } from '@pinia/testing'
import { useTransactionsStore } from '@stores/transactions'
import { mount, VueWrapper } from '@vue/test-utils'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { ref } from 'vue'

// Mock the useWeeks hook
vi.mock('@api/hooks/transactions/useWeeks', () => ({
  useWeeks: () => ({
    data: ref([{ week_year: '42/2022' }, { week_year: '43/2022' }]),
    isLoading: ref(false),
    isFetching: ref(false),
    isError: ref(false),
    error: ref(null),
  }),
}))

describe('WeekSelect', () => {
  let store: TestingPinia
  let transactionsStore: ReturnType<typeof useTransactionsStore>
  let wrapper: VueWrapper

  beforeEach(async () => {
    store = createTestingPinia({
      initialState: {
        transactions: {
          weeks: [],
          selectedMonth: '',
          selectedWeek: '',
        },
      },
      stubActions: false,
    })

    transactionsStore = useTransactionsStore(store)

    wrapper = mount(WeekSelect, {
      global: {
        plugins: [VueQueryPlugin, store],
      },
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
    transactionsStore.selectedMonth = ''
    transactionsStore.selectedWeek = ''
    transactionsStore.weeks = []
  })

  test('should render', () => {
    expect(wrapper.exists()).toBe(true)
  })

  test('clearable should be true', async () => {
    const select = wrapper.findComponent({ name: 'ElSelect' })
    expect(select.vm.clearable).toBe(true)
  })

  test('should update selected week when store value changes', async () => {
    // Update the store directly
    transactionsStore.setSelectedWeek('42/2022')

    await wrapper.vm.$nextTick()

    const select = wrapper.findComponent({ name: 'ElSelect' })
    expect(select.vm.modelValue).toBe('42/2022')
  })

  test('should call setSelectedWeek when onChange is triggered', async () => {
    const setSelectedWeekSpy = vi.spyOn(transactionsStore, 'setSelectedWeek')

    const select = wrapper.findComponent({ name: 'ElSelect' })
    await select.vm.$emit('change', '43/2022')

    expect(setSelectedWeekSpy).toHaveBeenCalledWith('43/2022')
  })

  test('should clear selected week when onClear is triggered', async () => {
    // Set initial value
    transactionsStore.setSelectedWeek('42/2022')
    await wrapper.vm.$nextTick()

    const setSelectedWeekSpy = vi.spyOn(transactionsStore, 'setSelectedWeek')

    const select = wrapper.findComponent({ name: 'ElSelect' })
    await select.vm.$emit('clear')

    expect(setSelectedWeekSpy).toHaveBeenCalledWith('')
  })

  test('should display week options from mocked data', async () => {
    await wrapper.vm.$nextTick()

    const options = wrapper.findAllComponents({ name: 'ElOption' })
    expect(options).toHaveLength(2)

    expect(options[0]?.vm.value).toBe('42/2022')
    expect(options[1]?.vm.value).toBe('43/2022')
  })
})
