<template>
  <div>
    <AlertComponent
      v-if="error && isError"
      :title="error.name"
      :message="error.message"
      type="error"
    />
    <div class="budget-category-selector">
      <el-tree-select
        :placeholder="props.placeholder"
        :data="selectTreeData"
        v-model="model"
        class="tree-select"
        :data-testid="props.dataTestId"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { ElTreeSelect } from 'element-plus'
import { useBudgetCategories } from '@api/hooks/budgetCategories/useBudgetCategories.ts'
import { convertToTree } from '@api/helpers/convertToTree.ts'
import AlertComponent from '@components/shared/AlertComponent.vue'

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

console.log('[BudgetCategoryTreeSelect] Initial model value:', model.value)

// Watch for changes to the model value
watch(
  () => model.value,
  (newValue, oldValue) => {
    console.log('[BudgetCategoryTreeSelect] Model value changed:', {
      oldValue,
      newValue,
      timestamp: new Date().toISOString()
    })
  },
  { immediate: true }
)

const { data, isError, error } = useBudgetCategories(undefined, undefined, false)

const selectTreeData = computed(() => {
  if (!data.value?.length) return []

  // The API returns { json: [{ data: { /* nested categories */ } }] }
  const categoryData = data.value[0]?.data
  if (!categoryData) return []

  const treeData = convertToTree(categoryData).flat()
  console.log('[BudgetCategoryTreeSelect] Tree data loaded:', {
    numberOfCategories: treeData.length,
    currentModelValue: model.value
  })
  return treeData
})
</script>

<style scoped>
.budget-category-selector {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
}

.tree-select {
  width: 100%;
  min-width: 200px;
}
</style>
