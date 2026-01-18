import { test, beforeEach, describe, expect, vi } from 'vitest'
import { mount, VueWrapper, flushPromises } from '@vue/test-utils'
import MemoSelect from '@components/transactions/selects/MemoSelect.vue'
import { ElAutocomplete } from 'element-plus'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createTestingPinia } from '@pinia/testing'
import AutocompleteComponent from '@components/shared/AutocompleteComponent.vue'
import { nextTick, ref } from 'vue'
import type { Memo } from '@types'

// Type for autocomplete options
interface AutocompleteOption {
  value: string
  label: string
}

// Create a reactive mock that can be updated
const mockMemos = ref<Memo[]>([])
const mockIsLoading = ref(false)
const mockIsError = ref(false)
const mockError = ref(null)

// Mock the useMemoSearch hook with reactive refs
vi.mock('@api/hooks/memos/useMemoSearch.ts', () => ({
  useMemoSearch: () => ({
    data: mockMemos,
    isLoading: mockIsLoading,
    isError: mockIsError,
    error: mockError,
  }),
}))

// Mock Vue Router
vi.mock('vue-router', () => ({
  useRoute: () => ({
    query: {},
  }),
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}))

describe('MemoSelect', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
    // Reset mocks before each test
    mockMemos.value = []
    mockIsLoading.value = false
    mockIsError.value = false
    mockError.value = null

    wrapper = mount(MemoSelect, {
      global: {
        plugins: [VueQueryPlugin, createTestingPinia()],
        stubs: {
          ElAutocomplete: false,
        },
      },
    })
  })

  test('should render', () => {
    expect(wrapper.exists()).toBe(true)
  })

  test('should render the AutocompleteComponent', async () => {
    expect(wrapper.findComponent(AutocompleteComponent).exists()).toBe(true)
  })

  test('should render the ElAutocomplete component', async () => {
    expect(wrapper.findComponent(ElAutocomplete).exists()).toBe(true)
  })

  test('clearable should be true on autocomplete', async () => {
    const autocomplete = wrapper.findComponent({ name: 'ElAutocomplete' })
    expect(autocomplete.exists()).toBe(true)
    expect(autocomplete.vm.clearable).toBe(true)
  })

  describe('Search functionality', () => {
    test('should call callback immediately with current options when handleSearch is called', async () => {
      // Setup: Add some initial memos
      mockMemos.value = [
        { id: 1, name: 'Groceries', budget_category: 'Food' } as Memo,
        { id: 2, name: 'Gas', budget_category: 'Transportation' } as Memo,
      ]
      await nextTick()

      const autocomplete = wrapper.findComponent(AutocompleteComponent)
      const handleSearch = autocomplete.props('onSearch') as (
        query: string,
        callback: (results: AutocompleteOption[]) => void,
      ) => void

      // Create a mock callback
      const callback = vi.fn()

      // Call handleSearch
      handleSearch('Gro', callback)

      // Should be called immediately with current options
      expect(callback).toHaveBeenCalledWith([
        { value: 'Groceries', label: 'Groceries', id: 1 },
        { value: 'Gas', label: 'Gas', id: 2 },
      ])
    })

    test('should call callback again when memoOptions updates after search', async () => {
      // Setup: Start with initial memos
      mockMemos.value = [
        { id: 1, name: 'Groceries', budget_category: 'Food' } as Memo,
        { id: 2, name: 'Gas', budget_category: 'Transportation' } as Memo,
      ]
      await nextTick()

      const autocomplete = wrapper.findComponent(AutocompleteComponent)
      const handleSearch = autocomplete.props('onSearch') as (
        query: string,
        callback: (results: AutocompleteOption[]) => void,
      ) => void

      // Create a mock callback
      const callback = vi.fn()

      // Call handleSearch
      handleSearch('Coffee', callback)

      // Should be called immediately with current (old) options
      expect(callback).toHaveBeenCalledTimes(1)
      expect(callback).toHaveBeenLastCalledWith([
        { value: 'Groceries', label: 'Groceries', id: 1 },
        { value: 'Gas', label: 'Gas', id: 2 },
      ])

      // Simulate the query returning new results
      mockMemos.value = [
        { id: 3, name: 'Coffee Shop', budget_category: 'Food' } as Memo,
        { id: 4, name: 'Coffee Beans', budget_category: 'Food' } as Memo,
      ]
      await nextTick()
      await flushPromises()

      // Callback should be called again with new options
      expect(callback).toHaveBeenCalledTimes(2)
      expect(callback).toHaveBeenLastCalledWith([
        { value: 'Coffee Shop', label: 'Coffee Shop', id: 3 },
        { value: 'Coffee Beans', label: 'Coffee Beans', id: 4 },
      ])
    })

    test('should not call old callbacks when a new search is initiated', async () => {
      mockMemos.value = [{ id: 1, name: 'Initial', budget_category: 'Test' } as Memo]
      await nextTick()

      const autocomplete = wrapper.findComponent(AutocompleteComponent)
      const handleSearch = autocomplete.props('onSearch') as (
        query: string,
        callback: (results: AutocompleteOption[]) => void,
      ) => void

      const firstCallback = vi.fn()
      const secondCallback = vi.fn()

      // First search
      handleSearch('first', firstCallback)
      expect(firstCallback).toHaveBeenCalledTimes(1)

      // Second search (should replace pending callback)
      handleSearch('second', secondCallback)
      expect(secondCallback).toHaveBeenCalledTimes(1)

      // Update memos
      mockMemos.value = [{ id: 2, name: 'Updated', budget_category: 'Test' } as Memo]
      await nextTick()
      await flushPromises()

      // Only the second callback should be called with new results
      expect(firstCallback).toHaveBeenCalledTimes(1) // Only initial call
      expect(secondCallback).toHaveBeenCalledTimes(2) // Initial + update
      expect(secondCallback).toHaveBeenLastCalledWith([
        { value: 'Updated', label: 'Updated', id: 2 },
      ])
    })

    test('should filter out memos with empty names', async () => {
      mockMemos.value = [
        { id: 1, name: 'Valid Memo', budget_category: 'Food' } as Memo,
        { id: 2, name: '', budget_category: 'Transportation' } as Memo,
        { id: 3, name: '   ', budget_category: 'Shopping' } as Memo,
        { id: 4, name: 'Another Valid', budget_category: 'Bills' } as Memo,
      ]
      await nextTick()

      const autocomplete = wrapper.findComponent(AutocompleteComponent)
      const handleSearch = autocomplete.props('onSearch') as (
        query: string,
        callback: (results: AutocompleteOption[]) => void,
      ) => void
      const callback = vi.fn()

      handleSearch('test', callback)

      expect(callback).toHaveBeenCalledWith([
        { value: 'Valid Memo', label: 'Valid Memo', id: 1 },
        { value: 'Another Valid', label: 'Another Valid', id: 4 },
      ])
    })

    test('should handle empty results gracefully', async () => {
      mockMemos.value = []
      await nextTick()

      const autocomplete = wrapper.findComponent(AutocompleteComponent)
      const handleSearch = autocomplete.props('onSearch') as (
        query: string,
        callback: (results: AutocompleteOption[]) => void,
      ) => void
      const callback = vi.fn()

      handleSearch('nonexistent', callback)

      expect(callback).toHaveBeenCalledWith([])
    })
  })

  describe('Clear functionality', () => {
    test('should clear search query when clearSelectedMemo is called', async () => {
      mockMemos.value = [{ id: 1, name: 'Test Memo', budget_category: 'Food' } as Memo]
      await nextTick()

      const autocomplete = wrapper.findComponent(AutocompleteComponent)

      // Simulate search
      const handleSearch = autocomplete.props('onSearch') as (
        query: string,
        callback: (results: AutocompleteOption[]) => void,
      ) => void
      const callback = vi.fn()
      handleSearch('Test', callback)

      // Clear the selection
      const onClear = autocomplete.props('onClear') as () => void
      onClear()

      // Search query should be cleared (we can verify by triggering another search)
      handleSearch('', callback)

      // Component should emit update:modelValue with empty string
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([''])
    })
  })
})
