<template>
  <AlertComponent v-if="error && isError" :title="error.name" :message="error.message" type="error" />
  <div class="flex-container">
    <el-row :gutter="35">
      <el-col :span="12">
        <el-tree-select
          :placeholder="props.placeholder"
          :data="selectTreeData"
          v-model="model"
          class="tree-select"
          show-checkbox
        />
      </el-col>
      <el-col :span="10">
        <div v-if="model" class="button-container">
          <el-button
            type="danger"
            @click="resetSelectedBudgetCategory"
          >
            Reset Category
          </el-button>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, defineEmits } from 'vue'
import { ElTreeSelect } from 'element-plus'
import { useBudgetCategories } from '@api/hooks/transactions/useBudgetCategories'
import { convertToTree } from '@api/helpers/convertToTree'
import { useTransactionsStore } from '@stores/transactions'
import type { BudgetCategoryResponse, CategoryNode } from '@types'
import AlertComponent from '@components/shared/AlertComponent.vue'

const props = defineProps({
  selectedBudgetCategory: {
    type: String
  },
  placeholder: {
    type: String,
    default: 'Select a budget category'
  },
  modelValue: {
    type: String,
    default: ''
  }
})

let model = defineModel({
  type: String,
  default: ''
})

const emit = defineEmits(['update:selected-budget-category'])

const store = useTransactionsStore()

const { data, isError, error } = useBudgetCategories()

const selectTreeData = computed<CategoryNode[]>(() => {
  if (!data.value || !data.value.length) {
    return []
  }
  const arr = data.value as unknown as BudgetCategoryResponse[]
  return arr.map((item) => convertToTree(item.data)).flat()
})


const resetSelectedBudgetCategory = () => {
  model.value = ''
  store.setSelectedBudgetCategory(null)
  emit('update:selected-budget-category', null)
}


</script>

<style scoped>
.text {
  align-self: start;
}

.flex-container {
  display: flex;
  align-items: start;
  flex-direction: column;
}

.button-container {
  margin-left: auto;
}

.tree-select {
  width: 10vw;
}
</style>
