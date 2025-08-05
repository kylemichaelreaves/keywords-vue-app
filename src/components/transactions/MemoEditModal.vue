<template>
  <el-dialog
    v-model="isVisible"
    :title="modalTitle"
    :close-on-click-modal="false"
    width="50%"
    data-testid="memo-edit-dialog"
    :before-close="handleClose"
  >
    <MemoEditForm
      v-if="memoData && !isLoading && isVisible"
      :memo="memoData"
      data-testid="memo-edit-form"
      @close="handleClose"
    />
    <div v-else-if="isLoading && isVisible" class="loading-state">
      Loading memo data...
    </div>
    <div v-else-if="isError && isVisible" class="error-state">
      Error loading memo: {{ error?.message }}
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import MemoEditForm from '@components/transactions/MemoEditForm.vue'
import useMemo from '@api/hooks/transactions/useMemo'

// Props
interface Props {
  memoName?: string
}

const props = withDefaults(defineProps<Props>(), {
  memoName: ''
})

const isVisible = ref(false)


const { data: memoData, isError, isLoading, error, refetch } = useMemo(
  computed(() => props.memoName),
)

const modalTitle = computed(() => {
  return memoData.value ? `Edit Memo: ${memoData.value.name}` : 'Edit Memo'
})

const openModal = () => {
  isVisible.value = true
  // Manually trigger refetch when modal opens with a memo name
  if (props.memoName) {
    refetch()
  }
}

const handleClose = () => {
  isVisible.value = false
}

// Watch for memo name changes when modal is visible and refetch
watch(() => props.memoName, (newMemoName) => {
  if (isVisible.value && newMemoName) {
    console.log('MemoEditModal: Memo name changed to:', newMemoName)
    refetch()
  }
}, { immediate: false })

defineExpose({
  openModal,
  handleClose
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
