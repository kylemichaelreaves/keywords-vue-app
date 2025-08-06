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
        show-checkbox
        :data-testid="props.dataTestId"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElTreeSelect } from 'element-plus'
import { useBudgetCategories } from '@api/hooks/transactions/useBudgetCategories'
import { convertToTree } from '@api/helpers/convertToTree'
import type { BudgetCategoryResponse } from '@types'
import AlertComponent from '@components/shared/AlertComponent.vue'

interface Props {
  placeholder?: string
  dataTestId?: string
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select a budget category',
  dataTestId: 'budget-category-tree-select'
})


const model = defineModel<string>({
  default: ''
})

const { data, isError, error } = useBudgetCategories(undefined, undefined, false)

const selectTreeData = computed(() => {
  if (!data.value?.length) return []

  return data.value
    .map((item: BudgetCategoryResponse) => convertToTree(item.data))
    .flat()
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