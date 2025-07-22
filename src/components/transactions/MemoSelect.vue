<template>
  <AlertComponent
    v-if="error && isError"
    :title="error.name"
    :message="error.message"
    type="error"
    :data-test-id="errorAlertDataTestId"
  />
  <SelectComponent
    :data-testid="props.dataTestId"
    :on-clear="clearSelectedMemo"
    :on-change="updateSelectedMemo"
    :placeholder="props.placeholder"
    :selectedValue="model"
    :options="memoOptions"
    :disabled="isFetching || isLoading || isRefetching"
    :data-test-id="props.dataTestId"
  />
</template>

<script setup lang='ts'>
import { computed, onMounted } from 'vue'
import useMemos from '@api/hooks/transactions/useMemos'
import { useTransactionsStore } from '@stores/transactions'
import type { Memo } from '@types'
import SelectComponent from '@components/shared/SelectComponent.vue'
import AlertComponent from '@components/shared/AlertComponent.vue'
import { router } from '@router'

const model = defineModel({
  type: String,
  default: ''
})


const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: 'Select a memo'
  },
  dataTestId: {
    type: String,
    default: 'transactions-table-memo-select'
  }
})

const errorAlertDataTestId = computed(() => {
  return props.dataTestId ? `${props.dataTestId}-error` : ''
})

const transactionsStore = useTransactionsStore()

// const selectedMemo = computed(() => transactionsStore.getSelectedMemo)

const emit = defineEmits(['update:modelValue'])

const { data, isLoading, isFetching, isError, error, refetch, isRefetching } = useMemos()

const memoOptions = computed(() => {
  if (!data.value) {
    return []
  }

  // `data.value.pages` is an array of arrays.
  // Flatten them if each page is an array of Memos:
  const allMemos = data.value.pages.flatMap(page => page)

  return allMemos.map((memo: Memo) => ({
    value: memo.name,
    label: memo.name
  }))
})

const clearSelectedMemo = () => {
  transactionsStore.setSelectedMemo('')
  emit('update:modelValue', '')
  router.push('/budget-visualizer/memos')
}

const updateSelectedMemo = (memo: string) => {
  // transactionsStore.setSelectedMemo(memo)
  emit('update:modelValue', memo)
}

onMounted(() => {
  if (data.value) {
    transactionsStore.setMemos(data.value.pages.flatMap(page => page))
  }
})


</script>

<style scoped>
</style>
