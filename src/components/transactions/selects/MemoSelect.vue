<!-- MemoSelect.vue - Memo Autocomplete Selector -->
<template>
  <div aria-label="Memo Selector">
    <AlertComponent
      v-if="error && isError"
      :title="error.name"
      :message="error.message"
      type="error"
      :data-test-id="errorAlertDataTestId"
    />
    <AutocompleteComponent
      v-model="model"
      :placeholder="props.placeholder"
      :options="memoOptions"
      :disabled="false"
      :data-testid="props.dataTestId"
      :min-characters="1"
      :on-clear="clearSelectedMemo"
      :on-search="handleSearch"
      :loading="isLoading"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useMemoSearch } from '@api/hooks/memos/useMemoSearch.ts'
import { useTransactionsStore } from '@stores/transactions.ts'
import { fetchMemos } from '@api/memos/fetchMemos.ts'
import type { Memo } from '@types'
import AutocompleteComponent from '@components/shared/AutocompleteComponent.vue'
import AlertComponent from '@components/shared/AlertComponent.vue'

const route = useRoute()
const router = useRouter()

const model = defineModel({
  type: String,
  default: '',
})

const props = defineProps({
  placeholder: {
    type: String,
    default: 'Select a memo',
  },
  dataTestId: {
    type: String,
    default: 'transactions-table-memo-select',
  },
})

const errorAlertDataTestId = computed(() => (props.dataTestId ? `${props.dataTestId}-error` : ''))

const transactionsStore = useTransactionsStore()
const emit = defineEmits(['update:modelValue'])

const searchQuery = ref('')
const pendingCallback = ref<((results: { value: string; label: string }[]) => void) | null>(null)

const {
  data: memos,
  isLoading,
  isError,
  error,
} = useMemoSearch({
  searchQuery,
  limit: 50,
})

const memoOptions = computed(() => {
  if (!memos.value) return []

  return memos.value
    .filter((memo: Memo) => memo.name && memo.name.trim() !== '')
    .map((memo: Memo) => ({
      value: memo.name, // Use name as value so it displays correctly in input
      label: memo.name,
      id: memo.id, // Store ID for URL usage
    }))
})

// Helper to find memo ID by name
const findMemoIdByName = (name: string): number | undefined => {
  if (!memos.value) return undefined
  const memo = memos.value.find((m: Memo) => m.name === name)
  return memo?.id
}

// Watch for when memos data changes and call the pending callback
watch([memoOptions, isLoading], ([newOptions, loading]) => {
  if (!loading && pendingCallback.value) {
    pendingCallback.value(newOptions)
    pendingCallback.value = null
  }
})

const handleSearch = (
  query: string,
  callback: (results: { value: string; label: string }[]) => void,
) => {
  // Update search query, which triggers the fetch
  searchQuery.value = query
  // If data is already loaded and not currently loading, call callback immediately
  if (!isLoading.value && memoOptions.value.length > 0) {
    callback(memoOptions.value)
  } else {
    // Otherwise, store the callback to be called when data arrives
    // This ensures we get the latest data for this search query
    pendingCallback.value = callback
  }
}

const clearSelectedMemo = () => {
  // The watcher will handle calling setSelectedMemo when model changes
  emit('update:modelValue', '')
  searchQuery.value = ''

  // Update URL to remove memo parameter
  const query = { ...route.query }
  delete query.memo
  router.replace({ query })
}

// Watch model changes and update the store to trigger useTransactions filtering
// model value is the memo name as a string, or empty string for no selection
watch(model, (newValue) => {
  transactionsStore.setSelectedMemo(newValue || '')
  // Update URL with memo ID (not name) for brevity
  const query = { ...route.query }
  if (newValue) {
    const memoId = findMemoIdByName(newValue)
    if (memoId) {
      query.memo = String(memoId)
    }
  } else {
    delete query.memo
  }
  router.replace({ query })
})

// Initialize from URL on mount - fetch memo by ID if present
onMounted(async () => {
  const memoFromUrl = route.query.memo
  if (!memoFromUrl) return

  // Parse memo ID from URL - handle string or array
  const memoIdStr = Array.isArray(memoFromUrl) ? memoFromUrl[0] : memoFromUrl
  if (!memoIdStr) return

  const memoId = Number.parseInt(memoIdStr, 10)
  if (Number.isNaN(memoId)) return

  // Skip if model already has a value (to avoid overwriting user selection)
  if (model.value) {
    console.log('[MemoSelect] Model already has value, skipping URL initialization:', model.value)
    return
  }

  try {
    console.log('[MemoSelect] Fetching memo by ID from URL:', memoId)
    // Fetch memo by ID using fetchMemos
    const memosData = await fetchMemos({ id: memoId })
    console.log('[MemoSelect] Memo fetched:', memosData)

    if (memosData && memosData.length > 0) {
      const memo = memosData[0]
      if (memo && memo.name) {
        model.value = memo.name
        transactionsStore.setSelectedMemo(memo.name)
        console.log('[MemoSelect] Model and store updated with memo name:', memo.name)
      }
    }
  } catch (error) {
    console.error('[MemoSelect] Error fetching memo by ID from URL:', error)
  }
})
</script>
