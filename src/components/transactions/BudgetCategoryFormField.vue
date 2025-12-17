<template>
  <div class="budget-category-form-field">
    <div class="field-container">
      <BudgetCategoryTreeSelect
        v-if="!isSplit"
        :model-value="modelValue"
        @update:model-value="handleCategoryUpdate"
        :data-testid="dataTestId"
        class="tree-select"
      />
      <div v-else class="split-info">
        <el-tag type="info" size="large">
          Split into {{ splits.length }} {{ splits.length === 1 ? 'category' : 'categories' }}
        </el-tag>
        <el-button
          type="primary"
          @click="openSplitDrawer"
          :data-testid="`${dataTestId}-edit-splits-button`"
        >
          {{ splits.length > 0 ? 'Edit Splits' : 'Configure Splits' }}
        </el-button>
      </div>
    </div>

    <el-checkbox
      v-model="isSplit"
      class="split-checkbox"
      :data-testid="`${dataTestId}-split-checkbox`"
    >
      Split into multiple categories
    </el-checkbox>

    <!-- Split Drawer -->
    <SplitBudgetCategoryDrawer
      v-model="splitDrawerVisible"
      :splits="localSplits"
      :transaction-amount="transactionAmount"
      @submit="handleSplitsSubmit"
      @cancel="handleSplitsCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import BudgetCategoryTreeSelect from '@components/transactions/selects/BudgetCategoriesTreeSelect.vue'
import SplitBudgetCategoryDrawer from '@components/transactions/SplitBudgetCategoryDrawer.vue'
import type { SplitBudgetCategory } from '@types'
import { generateId } from '@components/transactions/helpers/generateId.ts'

interface Props {
  modelValue: string
  splits?: SplitBudgetCategory[]
  transactionAmount: number
  dataTestId?: string
}

interface Emits {
  (e: 'update:modelValue', value: string | null): void
  (e: 'update:splits', value: SplitBudgetCategory[]): void
  (e: 'update:isSplit', value: boolean): void
}

const props = withDefaults(defineProps<Props>(), {
  dataTestId: 'budget-category-form-field',
  splits: () => [],
})

const emit = defineEmits<Emits>()

const splitDrawerVisible = ref(false)
const localSplits = ref<SplitBudgetCategory[]>([...props.splits])
const isSplit = ref(props.splits.length > 0)

// Watch for external changes to splits
watch(
  () => props.splits,
  (newValue) => {
    localSplits.value = [...newValue]
    // Update isSplit if splits are provided externally
    if (newValue.length > 0 && !isSplit.value) {
      isSplit.value = true
    }
  },
  { deep: true },
)

// Watch isSplit toggle
watch(isSplit, (newValue) => {
  emit('update:isSplit', newValue)

  if (newValue) {
    // Switching to split mode
    if (localSplits.value.length === 0) {
      // Initialize with current category if one is selected
      localSplits.value = [
        {
          id: generateId(),
          budget_category: props.modelValue ? props.modelValue : "",
          amount_debit: props.transactionAmount,
        },
      ]
      emit('update:splits', localSplits.value)
    }
    // Clear single category
    emit('update:modelValue', null)
    // Auto-open drawer when enabling split mode
    splitDrawerVisible.value = true
  } else {
    // Switching back to single category mode
    // Clear splits
    localSplits.value = []
    emit('update:splits', [])
  }
})

// Handle single category update
const handleCategoryUpdate = (value: string | null) => {
  emit('update:modelValue', value)
}

// Open split drawer
const openSplitDrawer = () => {
  splitDrawerVisible.value = true
}

// Handle split submission
const handleSplitsSubmit = (splits: SplitBudgetCategory[]) => {
  localSplits.value = splits
  emit('update:splits', splits)
  ElMessage.success('Splits saved')
}

// Handle split cancellation
const handleSplitsCancel = () => {
  // If no splits exist and user cancels, turn off split mode
  if (localSplits.value.length === 0) {
    isSplit.value = false
  }
}
</script>

<style scoped lang="scss">
.budget-category-form-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;

  .field-container {
    display: flex;
    gap: 12px;
    align-items: center;
    width: 100%;

    .tree-select {
      flex: 1;
    }

    .split-info {
      display: flex;
      gap: 12px;
      align-items: center;
      flex: 1;
    }
  }

  .split-checkbox {
    margin-left: 0;
  }
}
</style>
