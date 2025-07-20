<template>
  <AlertComponent
    v-if="error && isError"
    :title="error.name"
    :message="error.message"
    type="error"
  />

  <div class="budget-category-selector">
    <el-row :gutter="24">
      <el-col :span="18">
        <el-tree-select
          :placeholder="props.placeholder"
          :data="selectTreeData"
          v-model="model"
          class="tree-select"
          show-checkbox
        />
      </el-col>
      <el-col :span="6">
        <el-button
          v-if="model"
          type="danger"
          @click="resetSelection"
          class="reset-button"
        >
          Reset Category
        </el-button>
      </el-col>
    </el-row>
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
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select a budget category'
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

const resetSelection = () => {
  model.value = ''
}
</script>

<style scoped>
.budget-category-selector {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.tree-select {
  width: 100%;
  min-width: 200px;
}

.reset-button {
  width: 100%;
}
</style>