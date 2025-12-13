<template>
  <el-dialog v-model="dialogVisible" :title="title">
    <AlertComponent
      v-if="error && isError"
      :title="error.name"
      :message="error.message"
      type="error"
    />
    <el-text size="large">{{ memoDisplayName }}</el-text>
    <BudgetCategoriesTreeSelect v-model="selectedCategory" />
    <template #footer>
      <el-button @click="closeModal">Cancel</el-button>
      <el-button type="primary" @click="saveCategory">Save</el-button>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ElButton, ElDialog, ElMessage } from 'element-plus'
import { computed, type PropType } from 'vue'
import { useQueryClient } from '@tanstack/vue-query'
import BudgetCategoriesTreeSelect from '@components/transactions/BudgetCategoriesTreeSelect.vue'
import AlertComponent from '@components/shared/AlertComponent.vue'
import type { Memo } from '@types'
import mutateMemo from '@api/hooks/memos/mutateMemo.ts'
import useMemo from '@api/hooks/memos/useMemo.ts'

const props = defineProps({
  title: {
    type: String,
    default: 'Assign Budget Category',
  },
  memo: {
    type: Object as PropType<Memo>,
    required: true,
  },
})

const dialogVisible = defineModel<boolean>('visible', { default: false })
const selectedCategory = defineModel<string>('selectedBudgetCategory', { default: '' })

const emit = defineEmits(['categoryUpdated', 'memoUpdated'])

const memoId = computed(() => props.memo.id)

const { data: memoData, refetch } = useMemo(memoId)

const memoObject = computed(() => {
  if (typeof props.memo === 'object') {
    return props.memo
  }
  return memoData.value
})

const memoDisplayName = computed(() => props.memo.name)

const { error, mutate, isError } = mutateMemo()

const queryClient = useQueryClient()

const saveCategory = () => {
  if (!selectedCategory.value) {
    ElMessage.warning('Please select a budget category before saving.')
    return
  }

  const memo = memoObject.value

  if (!memo) {
    console.error('Memo object is null/undefined')
    ElMessage.error('Memo data not available.')
    return
  }

  if (!memo.id || typeof memo.id !== 'number') {
    console.error('Invalid memo ID:', memo.id, typeof memo.id)
    ElMessage.error('Invalid memo ID.')
    return
  }

  if (!memo.name) {
    console.error('Missing memo name:', memo.name)
    ElMessage.error('Missing memo name.')
    return
  }

  const mutationPayload = {
    memo: {
      id: memo.id,
      name: memo.name,
      budgetCategory: selectedCategory.value,
    },
  }

  mutate(mutationPayload, {
    onSuccess: () => {
      ElMessage.success('Budget category assigned successfully.')

      // Invalidate related queries to trigger refetches
      queryClient.invalidateQueries({ queryKey: ['month-summary'] })
      queryClient.invalidateQueries({ queryKey: ['week-summary'] })
      queryClient.invalidateQueries({ queryKey: ['memo', memo.name] })

      emit('categoryUpdated', selectedCategory.value)
      emit('memoUpdated', memo.name) // New event for broader scope
      closeModal()
      refetch()
    },
    onError: (error) => {
      console.error('Mutation error:', error)
      ElMessage.error(`An error occurred while assigning the budget category: ${error.message}`)
    },
  })

  console.log('Mutate function called')
}

const closeModal = () => {
  dialogVisible.value = false
}
</script>
