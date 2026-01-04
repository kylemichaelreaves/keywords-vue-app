<template>
  <div class="budget-category-form-field">
    <div class="field-container">
      <BudgetCategoryTreeSelect
        v-if="!isSplit"
        :model-value="categoryId || undefined"
        @update:model-value="updateCategory"
        :data-testid="dataTestId"
      />
      <div v-else class="split-info">
        <el-tag type="info" size="large">
          {{ splits.length }} {{ splits.length === 1 ? 'category' : 'categories' }}
          <template v-if="validationError">
            <span class="validation-error">{{ validationError }}</span>
          </template>
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
      :model-value="isSplit"
      @update:model-value="toggleMode"
      :data-testid="`${dataTestId}-split-checkbox`"
    >
      Split into multiple categories
    </el-checkbox>

    <SplitBudgetCategoryDrawer
      v-model="splitDrawerVisible"
      :splits="splits"
      :transaction-amount="transactionAmount"
      @submit="updateSplits"
      @cancel="handleDrawerCancel"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch, nextTick } from 'vue'
import BudgetCategoryTreeSelect from '@components/transactions/selects/BudgetCategoriesTreeSelect.vue'
import SplitBudgetCategoryDrawer from '@components/transactions/SplitBudgetCategoryDrawer.vue'
import type { BudgetCategoryState, SplitBudgetCategory } from '@types'
import { generateId } from '@components/transactions/helpers/generateId.ts'

interface Props {
  modelValue: BudgetCategoryState
  transactionAmount: number
  dataTestId?: string
}

const props = withDefaults(defineProps<Props>(), {
  dataTestId: 'budget-category-form-field',
})

type EmitType = (e: 'update:modelValue', value: BudgetCategoryState) => void
const emit = defineEmits<EmitType>()

const splitDrawerVisible = ref(false)


// Computed properties derived from modelValue
const isSplit = computed(() => props.modelValue.mode === 'split')

const splits = computed(() =>
  props.modelValue.mode === 'split' ? props.modelValue.splits : []
)

const categoryId = computed(() =>
  props.modelValue.mode === 'single' ? props.modelValue.categoryId : null
)

// Validation
const validationError = computed(() => {
  if (props.modelValue.mode !== 'split') return null

  const sum = props.modelValue.splits.reduce((acc, s) => acc + s.amount_debit, 0)
  const diff = Math.abs(sum - props.transactionAmount)

  if (diff > 0.01) {
    return `Total $${sum.toFixed(2)} doesn't match transaction $${props.transactionAmount.toFixed(2)}`
  }

  return null
})

// Toggle between single and split mode
function toggleMode(value: boolean | string | number) {
  const enableSplit = Boolean(value)

  if (enableSplit) {
    // Initialize with current category if one is selected
    const initialSplits: SplitBudgetCategory[] = []

    if (categoryId.value) {
      initialSplits.push({
        id: `${generateId()}`,
        budget_category_id: categoryId.value,
        amount_debit: props.transactionAmount,
      })
    }

    const splitState: BudgetCategoryState = {
      mode: 'split',
      splits: initialSplits
    }

    emit('update:modelValue', splitState)

    // Auto-open drawer for first-time setup
    if (initialSplits.length === 0) {
      // Use nextTick to ensure state is updated before opening drawer
      nextTick(() => {
        splitDrawerVisible.value = true
      })
    }
  } else {
    const singleState: BudgetCategoryState = {
      mode: 'single',
      categoryId: null
    }

    emit('update:modelValue', singleState)
  }
}

// Open split drawer
function openSplitDrawer() {
  splitDrawerVisible.value = true
}

// Update single category
function updateCategory(value: string | null) {
  const singleState: BudgetCategoryState = {
    mode: 'single',
    categoryId: value
  }

  emit('update:modelValue', singleState)
}

// Update splits from drawer
function updateSplits(newSplits: SplitBudgetCategory[]) {
  const splitState: BudgetCategoryState = {
    mode: 'split',
    splits: newSplits
  }

  emit('update:modelValue', splitState)
  splitDrawerVisible.value = false
}

// Handle drawer cancel - revert to single mode
function handleDrawerCancel() {
  const singleState: BudgetCategoryState = {
    mode: 'single',
    categoryId: null
  }

  emit('update:modelValue', singleState)
  splitDrawerVisible.value = false
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

    .split-info {
      display: flex;
      gap: 12px;
      align-items: center;
      flex: 1;

      .validation-error {
        margin-left: 8px;
        color: var(--el-color-danger);
        font-size: 12px;
      }
    }
  }

  .split-checkbox {
    margin-left: 0;
  }
}
</style>