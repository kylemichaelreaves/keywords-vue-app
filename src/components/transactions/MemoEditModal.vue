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
      v-if="selectedMemo"
      :memo="selectedMemo"
      data-testid="memo-edit-form"
      @close="handleClose"
    />
  </el-dialog>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import MemoEditForm from '@components/transactions/MemoEditForm.vue'
import type { Memo } from '@types'

const isVisible = ref(false)
const selectedMemo = ref<Memo | null>(null)

const modalTitle = computed(() => {
  return selectedMemo.value ? `Edit Memo: ${selectedMemo.value.name}` : 'Create New Memo'
})

const openModal = (memo: Memo) => {
  selectedMemo.value = memo
  isVisible.value = true
}

const handleClose = () => {
  isVisible.value = false
  selectedMemo.value = null
}

defineExpose({
  openModal,
  handleClose
})
</script>