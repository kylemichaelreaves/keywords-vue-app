<template>
  <div :data-testid="props.dataTestId">
    <AlertComponent
      v-if="error && isError"
      :title="error.name"
      :message="error.message"
      type="error"
      data-testid="memo-budget-category-error"
    />
    <el-col
      class="category-wrapper"
      data-testid="budget-category-column"
      :data-memo-id="props.memoId"
      :data-has-category="!!budgetCategory"
      :data-budget-category="budgetCategory || ''"
      :data-loading="isLoading || isFetching || isRefetching"
    >
      <el-text tag="u" size="large" data-testid="budget-category-label"> Budget Category: </el-text>

      <el-tag
        v-if="budgetCategory"
        class="category-tag"
        size="large"
        effect="dark"
        round
        data-testid="budget-category-tag"
        :data-memo-id="props.memoId"
        :data-category-value="budgetCategory"
      >
        {{ budgetCategory }}
      </el-tag>

      <el-button
        v-else-if="buttonCondition"
        class="category-tag"
        size="large"
        round
        type="danger"
        effect="dark"
        @click="openModal"
        data-testid="budget-category-button"
        :data-memo-id="props.memoId"
        :data-action="'assign-category'"
      >
        No Budget Category Assigned
      </el-button>
    </el-col>

    <BudgetCategoryModal
      v-model:visible="isModalVisible"
      v-model:selectedBudgetCategory="selectedBudgetCategory"
      :memo="memoObject"
      @categoryUpdated="onCategoryUpdated"
      @memoUpdated="onMemoUpdated"
      data-testid="budget-category-modal"
      :data-memo-id="props.memoId"
      :data-selected-category="selectedBudgetCategory"
    />
  </div>
</template>

<script setup lang="ts">
import useMemo from '@api/hooks/memos/useMemo.ts'
import type { Memo } from '@types'
import { computed, type PropType, ref, watch } from 'vue'
import AlertComponent from '@components/shared/AlertComponent.vue'
import BudgetCategoryModal from '@components/transactions/BudgetCategoryModal.vue'

const props = defineProps({
  memoId: {
    type: Number as PropType<Memo['id']>,
    required: true,
  },
  dataTestId: {
    type: String,
    default: 'memo-budget-category',
  },
})

const emit = defineEmits(['memoUpdated'])

const { data, isLoading, isError, refetch, isRefetching, isFetching, error } = useMemo(props.memoId)

const isModalVisible = ref(false)

const selectedBudgetCategory = ref('')

const budgetCategory = computed(() => {
  // useMemo returns a single Memo object, not an array
  const memo = data?.value as Memo | undefined
  return memo?.budget_category || null
})

const memoObject = computed(() => {
  // useMemo returns a single Memo object, not an array
  return (data?.value as Memo | undefined) || null
})

const buttonCondition = computed(() => {
  return !budgetCategory.value && !isFetching.value && !isLoading.value && !isRefetching.value
})

// Sync selected category with current budget category when modal opens
watch(isModalVisible, (newValue) => {
  if (newValue) {
    selectedBudgetCategory.value = budgetCategory.value || ''
  }
})

const openModal = () => {
  isModalVisible.value = true
}

const onCategoryUpdated = () => {
  refetch()
}

const onMemoUpdated = (memoId: number) => {
  emit('memoUpdated', memoId)
}

// Close modal on prop change
watch(
  () => props.memoId,
  () => {
    refetch()
  },
)
</script>

<style scoped>
.category-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
}

.category-tag {
  margin-left: 20px;
}
</style>
