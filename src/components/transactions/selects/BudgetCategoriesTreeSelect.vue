<template>
  <div class="budget-category-tree-select-wrapper">
    <el-alert
      v-if="error && isError"
      :title="error.name"
      :message="error.message"
      type="error"
      class="error-alert"
    />
    <el-tree-select
      :placeholder="placeholder"
      :data="selectTreeData"
      v-model="model"
      class="tree-select"
      :data-testid="props.dataTestId"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElTreeSelect, ElAlert } from 'element-plus'
import { useBudgetCategories } from '@api/hooks/budgetCategories/useBudgetCategories.ts'
import { convertToTree } from '@api/helpers/convertToTree.ts'

interface Props {
  placeholder?: string
  dataTestId?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select a budget category',
  dataTestId: 'budget-category-tree-select',
})

const model = defineModel<string>({
  default: '',
})

const { data, isError, error } = useBudgetCategories(undefined, undefined, false)

const selectTreeData = computed(() => {
  if (!data.value?.length) return []

  const categoryData = data.value[0]?.data
  if (!categoryData) return []

  return convertToTree(categoryData).flat()
})
</script>

<style scoped>
.budget-category-tree-select-wrapper {
  width: 100%;
  display: contents;
}

.error-alert {
  margin-bottom: 8px;
}

.tree-select {
  width: 100%;
}
</style>
