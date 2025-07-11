<template>
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
    :data-memo-name="props.memoName"
    :data-has-category="!!budgetCategory"
    :data-budget-category="budgetCategory || ''"
    :data-loading="isLoading || isFetching || isRefetching"
  >
    <el-text
      tag="u"
      size="large"
      data-testid="budget-category-label"
    >
      Budget Category:
    </el-text>

    <el-tag
      v-if="budgetCategory"
      class="category-tag"
      size="large"
      effect="dark"
      round
      data-testid="budget-category-tag"
      :data-memo-name="props.memoName"
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
      :data-memo-name="props.memoName"
      :data-action="'assign-category'"
    >
      No Budget Category Assigned
    </el-button>
  </el-col>

  <BudgetCategoryModal
    v-if="isModalVisible"
    :memo="props.memoName"
    :isVisible="isModalVisible"
    :selectedBudgetCategory="budgetCategory || ''"
    @update:isVisible="closeModal"
    @categoryUpdated="onCategoryUpdated"
    data-testid="budget-category-modal"
    :data-memo-name="props.memoName"
    :data-selected-category="budgetCategory || ''"
  />
</template>

<script setup lang="ts">
import useMemo from '@api/hooks/transactions/useMemo'
import type { Memo } from '@types'
import { computed, type PropType, ref, watch } from 'vue'
import AlertComponent from '@components/shared/AlertComponent.vue'
import BudgetCategoryModal from '@components/transactions/BudgetCategoryModal.vue'

const props = defineProps({
  memoName: {
    type: String as PropType<Memo['name']>,
    required: true
  },
  dataTestId: {
    type: String,
    default: 'memo-budget-category'
  }
})

const { data, isLoading, isError, refetch, isRefetching, isFetching, error } = useMemo(props.memoName)

const isModalVisible = ref(false)

const openModal = () => {
  isModalVisible.value = true
}

const closeModal = () => {
  isModalVisible.value = false
}

const onCategoryUpdated = () => {
  refetch()
  closeModal()
}

const budgetCategory = computed(() => {
  const budgetData = data?.value as Memo[] | undefined
  return budgetData ? budgetData[0]?.budget_category : null
})

const buttonCondition = computed(() => {
  return !budgetCategory.value && !isFetching.value && !isLoading.value && !isRefetching.value
})

watch(() => props.memoName, () => {
  refetch()
})
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