<!-- MemoAutocomplete.vue - Simplified -->
<template>
  <div>
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
      :disabled="isLoading"
      :data-testid="props.dataTestId"
      aria-label="Memo selector"
      :min-characters="1"
      :on-clear="clearSelectedMemo"
      :on-search="handleSearch"
      :loading="isLoading"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useMemoSearch } from '@api/hooks/memos/useMemoSearch.ts'
import { useTransactionsStore } from '@stores/transactions.ts'
import type { Memo } from '@types'
import AutocompleteComponent from '@components/shared/AutocompleteComponent.vue'
import AlertComponent from '@components/shared/AlertComponent.vue'

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

  return memos.value.map((memo: Memo) => ({
    value: String(memo.id),
    label: memo.name,
  }))
})

const handleSearch = (
  query: string,
  callback: (results: { value: string; label: string }[]) => void,
) => {
  searchQuery.value = query
  // Vue Query will automatically refetch, we just return current results
  callback(memoOptions.value)
}

const clearSelectedMemo = () => {
  // The watcher will handle calling setSelectedMemo when model changes
  emit('update:modelValue', '')
  searchQuery.value = ''
}

// Watch model changes and update the store to trigger useTransactions filtering
// model value is the memo ID as a string, or empty string for no selection
watch(model, (newValue) => {
  transactionsStore.setSelectedMemo(newValue || '')
})
</script>
