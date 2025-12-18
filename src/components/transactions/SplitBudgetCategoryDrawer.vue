<template>
  <el-drawer
    v-model="visible"
    title="Split Transaction"
    direction="rtl"
    size="700px"
    :before-close="handleCancel"
  >
    <div class="split-budget-category-drawer">
      <!-- Amount Summary -->
      <el-alert
        v-if="hasBeenTouched"
        :type="isValidTotal ? 'success' : 'warning'"
        :closable="false"
        show-icon
        class="amount-alert"
      >
        <template #title>
          <div class="amount-summary">
            <div>Transaction Amount: ${{ transactionAmount.toFixed(2) }}</div>
            <div>Split Total: ${{ totalAmount.toFixed(2) }}</div>
            <div v-if="!isValidTotal" class="amount-difference">
              Difference: ${{ difference.toFixed(2) }}
            </div>
          </div>
        </template>
      </el-alert>

      <!-- Splits Table -->
      <el-table :data="localSplits" style="width: 100%" :border="true" class="splits-table">
        <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :label="column.label"
          :width="column.width"
          :min-width="column.minWidth"
          :align="column.align"
        >
          <template #default="{ $index }">
            <component
              v-if="localSplits[$index]"
              :is="column.component"
              v-bind="column.getProps?.($index, localSplits[$index]) || {}"
              @update:model-value="column.onUpdate?.($index, $event)"
              @click="column.onClick?.($index)"
            />
          </template>
        </el-table-column>
      </el-table>

      <!-- Add Split Button -->
      <div class="add-split-container">
        <el-button :icon="Plus" @click="handleAddRow" :disabled="hasExceededTotal">
          Add Split
        </el-button>
      </div>

      <!-- Actions -->
      <div class="drawer-footer">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button type="primary" :disabled="!canSave" @click="handleSubmit">
          Save Splits
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, ref, watch, type Component } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElButton, ElInputNumber } from 'element-plus'
import BudgetCategoryTreeSelect from '@components/transactions/selects/BudgetCategoriesTreeSelect.vue'
import type { SplitBudgetCategory } from '@types'
import { generateId } from '@components/transactions/helpers/generateId.ts'

interface Props {
  modelValue: boolean
  splits: SplitBudgetCategory[]
  transactionAmount: number
}

interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', splits: SplitBudgetCategory[]): void
  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()


interface SplitTableColumn {
  prop: string
  label: string
  width?: string
  minWidth?: string
  align?: 'left' | 'center' | 'right'
  component: Component
  getProps?: (index: number, split: SplitBudgetCategory) => Record<string, unknown>
  onUpdate?: (index: number, value: unknown) => void
  onClick?: (index: number) => void
}

const visible = computed({
  get: () => props.modelValue,
  set: (value) => {
    if (!value) {
      hasBeenTouched.value = false  // Reset touched state when drawer closes
    }
    emit('update:modelValue', value)
  },
})

const hasBeenTouched = ref(false)

const initializeSplits = (splits: SplitBudgetCategory[]): SplitBudgetCategory[] => {
  const newSplits = [...splits]
  while (newSplits.length < 2) {
    const remainingAmount = props.transactionAmount - newSplits.reduce((sum, split) => sum + (Number(split.amount_debit) || 0), 0)
    newSplits.push({
      id: Number(generateId()),
      budget_category: '',
      amount_debit: remainingAmount > 0 ? Number((remainingAmount / (2 - newSplits.length)).toFixed(2)) : 0,
    })
  }
  return newSplits
}

const localSplits = ref<SplitBudgetCategory[]>(initializeSplits(props.splits))

watch(
  () => props.splits,
  (newValue) => {
    localSplits.value = initializeSplits(newValue)
  },
  { deep: true },
)

// Explicit handler for amount changes to ensure reactivity
const handleAmountChange = (index: number, value: unknown) => {
  hasBeenTouched.value = true
  const split = localSplits.value[index]
  if (split) {
    split.amount_debit = (value as number) ?? 0
  }
}

// Explicit handler for category changes
const handleCategoryChange = (index: number, value: unknown) => {
  hasBeenTouched.value = true
  const split = localSplits.value[index]
  if (split) {
    split.budget_category = value as string
  }
}

const handleRemove = (index: number) => {
  if (localSplits.value.length > 1) {
    localSplits.value.splice(index, 1)
  } else {
    ElMessage.warning('At least one split is required')
  }
}


const columns: SplitTableColumn[] = [
  {
    prop: 'budget_category',
    label: 'Budget Category',
    minWidth: '300',
    component: BudgetCategoryTreeSelect,
    getProps: (index: number, split: SplitBudgetCategory) => ({
      modelValue: split.budget_category,
    }),
    onUpdate: handleCategoryChange,
  },
  {
    prop: 'amount_debit',
    label: 'Amount',
    width: '180',
    component: ElInputNumber,
    getProps: (index: number, split: SplitBudgetCategory) => ({
      modelValue: split.amount_debit,
      precision: 2,
      step: 0.01,
      controls: false,
      placeholder: '0.00',
      style: 'width: 100%',
    }),
    onUpdate: handleAmountChange,
  },
  {
    prop: 'actions',
    label: '',
    width: '60',
    align: 'center',
    component: ElButton,
    getProps: (index: number) => ({
      icon: Delete,
      circle: true,
      size: 'small',
      type: 'danger',
      style: localSplits.value.length > 1 ? '' : 'display: none',
    }),
    onClick: handleRemove,
  },
]

const totalAmount = computed(() => {
  return localSplits.value.reduce((sum, split) => {
    return sum + (Number(split.amount_debit) || 0)
  }, 0)
})

const difference = computed(() => {
  return Math.abs(props.transactionAmount - totalAmount.value)
})

const isValidTotal = computed(() => {
  return Math.abs(props.transactionAmount - totalAmount.value) < 0.01
})

const hasExceededTotal = computed(() => {
  return totalAmount.value >= props.transactionAmount
})

const allCategoriesSelected = computed(() => {
  return localSplits.value.every(
    (split) => split.budget_category !== null && split.budget_category !== '',
  )
})

const canSave = computed(() => {
  return isValidTotal.value && allCategoriesSelected.value
})

const handleAddRow = () => {
  const remainingAmount = props.transactionAmount - totalAmount.value
  localSplits.value.push({
    id: Number(generateId()),
    budget_category: '',
    amount_debit: remainingAmount > 0 ? Number(remainingAmount.toFixed(2)) : 0,
  })
}

const handleSubmit = () => {
  if (!isValidTotal.value) {
    ElMessage.error('Split amounts must equal transaction amount')
    return
  }

  if (!allCategoriesSelected.value) {
    ElMessage.error('All splits must have a category selected')
    return
  }

  emit('submit', localSplits.value)
  visible.value = false
}

const handleCancel = () => {
  emit('cancel')
  visible.value = false
}
</script>

<style scoped lang="scss">
.split-budget-category-drawer {
  display: flex;
  flex-direction: column;
  height: 100%;

  .amount-alert {
    margin-bottom: 20px;

    .amount-summary {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .amount-difference {
        color: var(--el-color-danger);
        font-weight: bold;
      }
    }
  }

  .splits-table {
    flex: 1;
    margin-bottom: 16px;
  }

  .add-split-container {
    margin-bottom: 20px;
  }

  .drawer-footer {
    margin-top: auto;
    padding-top: 20px;
    border-top: 1px solid var(--el-border-color);
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>