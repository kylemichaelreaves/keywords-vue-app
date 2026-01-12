<template>
  <AlertComponent
    v-if="displayError && displayErrorObject"
    :message="displayErrorObject.message"
    type="error"
    :title="displayErrorObject.name"
  />
  <el-dialog
    v-model="isVisible"
    :title="modalTitle"
    :close-on-click-modal="false"
    width="50%"
    data-testid="memo-edit-dialog"
    :before-close="handleClose"
  >
    <MemoEditForm
      v-if="displayMemo && isVisible && !displayLoading"
      :memo="displayMemo"
      @close="handleClose"
    />
    <div v-else-if="displayLoading && isVisible" class="loading-state">Loading memo data...</div>
    <div v-else-if="displayError && isVisible" class="error-state">
      Error loading memo: {{ displayErrorObject?.message }}
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MemoEditForm from '@components/memos/MemoEditForm.vue'
import AlertComponent from '@components/shared/AlertComponent.vue'
import useMemoByName from '@api/hooks/memos/useMemoByName.ts'
import type { Memo } from '@types'

// Props
interface Props {
  memo?: Memo
  memoName?: string
}

const props = withDefaults(defineProps<Props>(), {
  memo: undefined,
  memoName: undefined,
})

const isVisible = ref(false)

// Watch for prop changes
watch(
  () => props.memo,
  (newMemo, oldMemo) => {
    console.log('🔵 MemoEditModal: props.memo changed', { oldMemo, newMemo })
  },
  { immediate: true, deep: true },
)

// Use useMemoByName hook when memoName is provided
const { data, isLoading, isError, error } = useMemoByName(computed(() => props.memoName || ''))

// For backwards compatibility when no memo fetching is needed
const legacyIsError = ref(false)
const legacyIsLoading = ref(false)
const legacyError = ref<Error | null>(null)

// Computed properties to determine what to display
const displayMemo = computed(() => {
  // If memo prop is provided directly, use it
  if (props.memo !== undefined) {
    return props.memo
  }
  // Only use fetched data if we have a valid memo name and data
  if (props.memoName && data.value) {
    return data.value
  }
  return null
})

const displayLoading = computed(() => {
  // If memo prop is provided, use the backwards compatible loading state
  if (props.memo !== undefined) {
    return legacyIsLoading.value
  }
  // Only show loading if we have a memo name to fetch
  return props.memoName ? isLoading.value : false
})

const displayError = computed(() => {
  // If memo prop is provided, use the backwards compatible error state
  if (props.memo !== undefined) {
    return legacyIsError.value
  }
  // Only show error if we have a memo name and there's an error
  return props.memoName ? isError.value : false
})

const displayErrorObject = computed(() => {
  // If memo prop is provided, use the backwards compatible error object
  if (props.memo !== undefined) {
    return legacyError.value
  }
  // Only return error if we have a memo name and there's an error
  return props.memoName ? error.value : null
})

const modalTitle = computed(() => {
  const memo = displayMemo.value
  return memo ? `Edit Memo: ${memo.name}` : 'Edit Memo'
})

const handleClose = () => {
  console.log('🔵 MemoEditModal: handleClose called')
  isVisible.value = false
}

const openModal = () => {
  console.log('🔵 MemoEditModal: openModal called, isVisible:', isVisible.value)
  console.log('🔵 MemoEditModal: props:', props)
  console.log('🔵 MemoEditModal: props.memo:', props.memo)
  console.log('🔵 MemoEditModal: props.memoName:', props.memoName)
  console.log('🔵 MemoEditModal: displayMemo computed:', displayMemo.value)
  console.log('🔵 MemoEditModal: displayLoading computed:', displayLoading.value)
  console.log('🔵 MemoEditModal: displayError computed:', displayError.value)
  isVisible.value = true
  console.log('🔵 MemoEditModal: isVisible set to true:', isVisible.value)
}

defineExpose({
  openModal,
  closeModal: handleClose,
})
</script>

<style scoped>
.loading-state,
.error-state {
  padding: 20px;
  text-align: center;
  color: #666;
}

.error-state {
  color: #f56c6c;
}
</style>
