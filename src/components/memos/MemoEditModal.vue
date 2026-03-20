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
      :key="displayMemo.id"
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
import { devConsole } from '@utils/devConsole'

import { computed, ref, watch } from 'vue'
import MemoEditForm from '@components/memos/MemoEditForm.vue'
import AlertComponent from '@components/shared/AlertComponent.vue'
import useMemoByName from '@api/hooks/memos/useMemoByName.ts'
import { useMemoById } from '@api/hooks/memos/useMemoById.ts'
import type { Memo } from '@types'

// Props
interface Props {
  memo?: Memo
  memoName?: string
  memoId?: number | null
}

const props = withDefaults(defineProps<Props>(), {
  memo: undefined,
  memoName: undefined,
  memoId: null,
})

const isVisible = ref(false)

// Use useMemoById hook when memoId is provided (preferred)
const {
  data: dataById,
  isLoading: isLoadingById,
  isError: isErrorById,
  error: errorById,
  refetch: refetchById,
} = useMemoById({
  memoId: computed(() => props.memoId || null),
})

// Use useMemoByName hook when memoName is provided (fallback)
const {
  data: dataByName,
  isLoading: isLoadingByName,
  isError: isErrorByName,
  error: errorByName,
} = useMemoByName(computed(() => props.memoName || ''))

// Watch for prop changes - AFTER hooks are defined
watch(
  () => props.memo,
  (newMemo, oldMemo) => {
    devConsole('log', '🔵 MemoEditModal: props.memo changed', { oldMemo, newMemo })
  },
  { immediate: true, deep: true },
)

watch(
  () => props.memoId,
  (newId, oldId) => {
    devConsole('log', '🔵 MemoEditModal: props.memoId changed', { oldId, newId })
  },
  { immediate: true },
)

watch(
  () => dataById.value,
  (newData) => {
    devConsole('log', '🔵 MemoEditModal: dataById changed', newData)
  },
  { immediate: true },
)

watch(
  () => isLoadingById.value,
  (loading) => {
    devConsole('log', '🔵 MemoEditModal: isLoadingById changed', loading)
  },
  { immediate: true },
)

// For backwards compatibility when no memo fetching is needed
const legacyIsError = ref(false)
const legacyIsLoading = ref(false)
const legacyError = ref<Error | null>(null)

// Computed properties to determine what to display
const displayMemo = computed(() => {
  devConsole('log', '🔵 displayMemo computed called', {
    hasMemo: props.memo !== undefined,
    memoId: props.memoId,
    dataById: dataById.value,
    memoName: props.memoName,
    dataByName: dataByName.value,
  })

  // If memo prop is provided directly, use it
  if (props.memo !== undefined) {
    return props.memo
  }
  // Prioritize memoId (more reliable than name)
  if (props.memoId && dataById.value) {
    return dataById.value
  }
  // Fallback to memoName
  if (props.memoName && dataByName.value) {
    return dataByName.value
  }
  return null
})

const displayLoading = computed(() => {
  // If memo prop is provided, use the backwards compatible loading state
  if (props.memo !== undefined) {
    return legacyIsLoading.value
  }
  // Prioritize memoId loading state
  if (props.memoId) {
    return isLoadingById.value
  }
  // Fallback to memoName loading state
  return props.memoName ? isLoadingByName.value : false
})

const displayError = computed(() => {
  // If memo prop is provided, use the backwards compatible error state
  if (props.memo !== undefined) {
    return legacyIsError.value
  }
  // Prioritize memoId error state
  if (props.memoId) {
    return isErrorById.value
  }
  // Fallback to memoName error state
  return props.memoName ? isErrorByName.value : false
})

const displayErrorObject = computed(() => {
  // If memo prop is provided, use the backwards compatible error object
  if (props.memo !== undefined) {
    return legacyError.value
  }
  // Prioritize memoId error
  if (props.memoId) {
    return errorById.value
  }
  // Fallback to memoName error
  return props.memoName ? errorByName.value : null
})

const modalTitle = computed(() => {
  const memo = displayMemo.value
  return memo ? `Edit Memo: ${memo.name}` : 'Edit Memo:'
})

const handleClose = () => {
  devConsole('log', '🔵 MemoEditModal: handleClose called')
  isVisible.value = false
}

const openModal = () => {
  devConsole('log', '🔵 MemoEditModal: openModal called')
  devConsole('log', '🔵 MemoEditModal: isVisible before:', isVisible.value)
  devConsole('log', '🔵 MemoEditModal: props:', {
    memo: props.memo,
    memoId: props.memoId,
    memoName: props.memoName,
  })
  devConsole('log', '🔵 MemoEditModal: hook states:', {
    dataById: dataById.value,
    isLoadingById: isLoadingById.value,
    isErrorById: isErrorById.value,
    dataByName: dataByName.value,
    isLoadingByName: isLoadingByName.value,
    isErrorByName: isErrorByName.value,
  })
  devConsole('log', '🔵 MemoEditModal: computed values:', {
    displayMemo: displayMemo.value,
    displayLoading: displayLoading.value,
    displayError: displayError.value,
    displayErrorObject: displayErrorObject.value,
  })

  // Force refetch to ensure we have the latest data
  if (props.memoId && refetchById) {
    devConsole('log', '🔵 MemoEditModal: Triggering refetch for memoId:', props.memoId)
    refetchById()
  }

  isVisible.value = true
  devConsole('log', '🔵 MemoEditModal: isVisible after:', isVisible.value)
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
