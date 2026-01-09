import { test, beforeEach, describe, expect, vi } from 'vitest'
import { mount, VueWrapper } from '@vue/test-utils'
import MemoSelect from '@components/transactions/selects/MemoSelect.vue'
import { ElAutocomplete } from 'element-plus'
import { VueQueryPlugin } from '@tanstack/vue-query'
import { createTestingPinia } from '@pinia/testing'
import AutocompleteComponent from '@components/shared/AutocompleteComponent.vue'

// Mock the useMemoSearch hook
vi.mock('@api/hooks/memos/useMemoSearch.ts', () => ({
  useMemoSearch: () => ({
    data: { value: [] },
    isLoading: false,
    isError: false,
    error: null,
  }),
}))

describe('MemoSelect', () => {
  let wrapper: VueWrapper

  beforeEach(() => {
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
})
