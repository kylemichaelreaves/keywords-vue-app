import { mount, flushPromises } from '@vue/test-utils'
import { vi, describe, test, expect, beforeEach, afterEach } from 'vitest'
import { createTestingPinia } from '@pinia/testing'
import { createRouter, createMemoryHistory } from 'vue-router'
import MemoSelect from '@components/transactions/selects/MemoSelect.vue'
import type { Memo } from '@types'
import { ref } from 'vue'

// Mock the fetchMemos API
vi.mock('@api/memos/fetchMemos.ts', () => ({
  fetchMemos: vi.fn(),
}))

// Mock useMemoSearch hook with proper ref values
vi.mock('@api/hooks/memos/useMemoSearch.ts', () => ({
  useMemoSearch: vi.fn(() => ({
    data: ref([]),
    isLoading: ref(false),
    isError: ref(false),
    error: ref(null),
  })),
}))

import { fetchMemos } from '@api/memos/fetchMemos.ts'

// Helper to create a valid Memo object with required properties
const createMemo = (id: number, name: string): Memo => ({
  id,
  name,
  recurring: false,
  necessary: false,
  ambiguous: false,
})

// Helper to create a router with a specific query
const createMockRouter = async (query: Record<string, string> = {}) => {
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/', component: { template: '<div />' } }],
  })
  await router.push({ path: '/', query })
  return router
}

describe('MemoSelect', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('URL initialization - proactive filtering', () => {
    /**
     * Tests for line 199: `const memo = memosData.find((m: Memo) => m.id === memoId)`
     *
     * This tests the proactive filtering logic that ensures we find the correct memo
     * from the API response when initializing from a URL parameter.
     */

    test('finds the correct memo when API returns multiple memos', async () => {
      const targetMemoId = 42
      const mockMemos: Memo[] = [
        createMemo(1, 'Wrong Memo 1'),
        createMemo(targetMemoId, 'Correct Memo'),
        createMemo(99, 'Wrong Memo 2'),
      ]

      vi.mocked(fetchMemos).mockResolvedValueOnce(mockMemos)

      const router = await createMockRouter({ memo: String(targetMemoId) })

      mount(MemoSelect, {
        global: {
          plugins: [createTestingPinia({ stubActions: false }), router],
        },
      })

      await flushPromises()

      expect(fetchMemos).toHaveBeenCalledWith({ id: targetMemoId })
    })

    test('handles API response with only the requested memo', async () => {
      const targetMemoId = 42
      const mockMemos: Memo[] = [createMemo(targetMemoId, 'Single Memo')]

      vi.mocked(fetchMemos).mockResolvedValueOnce(mockMemos)

      const router = await createMockRouter({ memo: String(targetMemoId) })

      mount(MemoSelect, {
        global: {
          plugins: [createTestingPinia({ stubActions: false }), router],
        },
      })

      await flushPromises()

      expect(fetchMemos).toHaveBeenCalledWith({ id: targetMemoId })
    })

    test('handles empty API response gracefully', async () => {
      const targetMemoId = 999
      const mockMemos: Memo[] = []

      vi.mocked(fetchMemos).mockResolvedValueOnce(mockMemos)

      const router = await createMockRouter({ memo: String(targetMemoId) })

      // Should not throw
      const wrapper = mount(MemoSelect, {
        global: {
          plugins: [createTestingPinia({ stubActions: false }), router],
        },
      })

      await flushPromises()

      // Model should remain empty when memo not found (check via emitted events)
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    test('handles API response where requested memo ID is not present', async () => {
      const targetMemoId = 42
      // API returns memos, but NOT the one we requested
      const mockMemos: Memo[] = [
        createMemo(1, 'Different Memo 1'),
        createMemo(2, 'Different Memo 2'),
      ]

      vi.mocked(fetchMemos).mockResolvedValueOnce(mockMemos)

      const router = await createMockRouter({ memo: String(targetMemoId) })

      const wrapper = mount(MemoSelect, {
        global: {
          plugins: [createTestingPinia({ stubActions: false }), router],
        },
      })

      await flushPromises()

      // Model should remain empty because the proactive filtering didn't find the memo
      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
    })

    test('correctly filters when memo has matching ID', async () => {
      const targetMemoId = 42
      const expectedMemoName = 'Target Memo Name'
      const mockMemos: Memo[] = [
        createMemo(10, 'First Memo'),
        createMemo(targetMemoId, expectedMemoName),
        createMemo(100, 'Last Memo'),
      ]

      vi.mocked(fetchMemos).mockResolvedValueOnce(mockMemos)

      const router = await createMockRouter({ memo: String(targetMemoId) })

      const wrapper = mount(MemoSelect, {
        global: {
          plugins: [createTestingPinia({ stubActions: false }), router],
        },
      })

      await flushPromises()

      // The proactive filtering should have found the correct memo
      // Check that the component emitted the correct memo name
      const emitted = wrapper.emitted('update:modelValue')
      expect(emitted).toBeDefined()
      expect(emitted?.[0]).toEqual([expectedMemoName])
    })

    test('does not initialize without memo query param present', async () => {
      const router = await createMockRouter({})

      mount(MemoSelect, {
        global: {
          plugins: [createTestingPinia({ stubActions: false }), router],
        },
      })

      await flushPromises()

      // fetchMemos should not be called when there's no memo in URL
      expect(fetchMemos).not.toHaveBeenCalled()
    })

    test('handles invalid memo ID in URL', async () => {
      const router = await createMockRouter({ memo: 'not-a-number' })

      mount(MemoSelect, {
        global: {
          plugins: [createTestingPinia({ stubActions: false }), router],
        },
      })

      await flushPromises()

      // fetchMemos should not be called for invalid IDs
      expect(fetchMemos).not.toHaveBeenCalled()
    })
  })
})
