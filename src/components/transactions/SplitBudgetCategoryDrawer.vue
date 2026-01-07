<template>
  <el-drawer
    v-model="visible"
    title="Split Transaction"
    direction="rtl"
    size="700px"
    :before-close="handleBeforeClose"
  >
    <div class="split-drawer-content">
      <el-alert
        v-if="validationMessage"
        :type="validationMessage.type"
        :closable="false"
        show-icon
        class="validation-alert"
      >
        <template #title>
          <div class="validation-content">
            <div>Transaction: ${{ absTransactionAmount.toFixed(2) }}</div>
            <div>Split Total: ${{ totalAmount.toFixed(2) }}</div>
            <div v-if="validationMessage.difference" class="difference" :class="{ 'over-amount': isOver }">
              Difference: {{ validationMessage.difference }}
            </div>
          </div>
        </template>
      </el-alert>

      <el-form ref="formRef" :model="{ splits: localSplits }" class="splits-form">
        <div class="splits-list">
          <div
            v-for="(split, index) in localSplits"
            :key="split.id"
            class="split-row"
          >
            <el-form-item
              :prop="`splits.${index}.budget_category_id`"
              :rules="getCategoryRules(index)"
              class="split-category-field"
            >
              <BudgetCategoryTreeSelect
                v-model="split.budget_category_id"
                :data-testid="`split-category-${index}`"
              />
            </el-form-item>

            <div class="split-amount">
              <el-input-number
                :model-value="split.amount_debit"
                @update:model-value="(value) => updateSplitAmount(index, value)"
                :precision="2"
                :step="0.01"
                :min="0"
                :max="getMaxAmountForSplit(index)"
                :controls="false"
                placeholder="0.00"
                :data-testid="`split-amount-${index}`"
              />
            </div>

            <div class="split-actions">
              <el-button
                v-if="localSplits.length > 1"
                :icon="Delete as any"
                circle
                size="small"
                type="danger"
                @click="removeSplit(index)"
                :data-testid="`split-remove-${index}`"
              />
            </div>
          </div>
        </div>
      </el-form>

      <div class="add-split-section">
        <el-button
          :icon="Plus as any"
          @click="addSplit"
          :disabled="addSplitDisabled"
        >
          Add Split
        </el-button>
        <span v-if="addSplitHintText" class="hint">
          {{ addSplitHintText }}
        </span>
      </div>

      <div class="drawer-footer">
        <el-button @click="handleCancel">Cancel</el-button>
        <el-button
          type="primary"
          :disabled="!isValid"
          @click="handleSubmit"
        >
          Save Splits
        </el-button>
      </div>
    </div>
  </el-drawer>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Delete, Plus } from '@element-plus/icons-vue'
import {
  ElInputNumber,
  ElMessage,
  ElMessageBox,
  type ElMessageBoxOptions,
  type FormInstance,
  type FormItemRule
} from 'element-plus'
import BudgetCategoryTreeSelect from '@components/transactions/selects/BudgetCategoriesTreeSelect.vue'
import type { SplitBudgetCategory } from '@types'
import { generateId } from '@components/transactions/helpers/generateId.ts'

interface Props {
  modelValue: boolean
  splits: SplitBudgetCategory[]
  transactionAmount: number
}
const props = defineProps<Props>()

type EmitType = {
  (e: 'update:modelValue', value: boolean): void
  (e: 'submit', splits: SplitBudgetCategory[]): void
  (e: 'cancel'): void
}
const emit = defineEmits<EmitType>()

const formRef = ref<FormInstance>()

// Drawer visibility
const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

// Local copy of splits for editing
const localSplits = ref<SplitBudgetCategory[]>([])

watch(
  () => props.modelValue,
  (isOpen) => {
    if (isOpen) {
      localSplits.value = props.splits.map(split => ({ ...split }))

      if (localSplits.value.length === 0) {
        const halfAmount = Number((props.transactionAmount / 2).toFixed(2))
        localSplits.value = [
          {
            id: `${generateId()}`,
            budget_category_id: '',
            amount_debit: halfAmount
          }
        ]
      }
      // Reset form validation when opening
      formRef.value?.clearValidate()
    }
  },
  { immediate: true }
)


// Dynamic validation rules for each category field
function getCategoryRules(index: number): FormItemRule[] {
  return [
    {
      validator: (_rule, _value, callback) => {
        const split = localSplits.value[index]
        if (!split) {
          callback()
          return
        }

        const hasAmount = split.amount_debit && split.amount_debit > 0
        const hasCategory = split.budget_category_id?.trim()

        if (hasAmount && !hasCategory) {
          callback(new Error('Category required for splits with amounts'))
        } else {
          callback()
        }
      },
      trigger: 'change'
    }
  ]
}

const absTransactionAmount = computed(() => Math.abs(props.transactionAmount))

const totalAmount = computed(() =>
  localSplits.value.reduce((sum, split) => sum + (split.amount_debit || 0), 0)
)

const difference = computed(() =>
  Math.abs(absTransactionAmount.value - totalAmount.value)
)

const isOver = computed(() =>
  totalAmount.value > absTransactionAmount.value
)

const isUnder = computed(() =>
  totalAmount.value < absTransactionAmount.value
)

const isValidTotal = computed(() => difference.value < 0.01)

const allCategoriesSelected = computed(() =>
  localSplits.value.every(split => {
    const hasAmount = split.amount_debit && split.amount_debit > 0
    const hasCategory = split.budget_category_id?.trim()

    // If has amount, must have category
    if (hasAmount) {
      return hasCategory
    }
    // If no amount, category is optional
    return true
  })
)

const isValid = computed(() =>
  isValidTotal.value &&
  allCategoriesSelected.value &&
  !isOver.value
)

const isDirty = computed(() => {
  if (localSplits.value.length !== props.splits.length) return true

  return localSplits.value.some((split, index) => {
    const original = props.splits[index]
    return !original ||
      split.budget_category_id !== original.budget_category_id ||
      Math.abs((split.amount_debit || 0) - (original.amount_debit || 0)) > 0.001
  })
})

const validationMessage = computed<{
  type: 'success' | 'warning'
  difference: string | null
} | null>(() => {
  if (!localSplits.value.length) return null

  if (isOver.value) {
    return {
      type: 'warning',
      difference: `$${difference.value.toFixed(2)} over`
    }
  }

  if (isUnder.value) {
    return {
      type: 'warning',
      difference: `$${difference.value.toFixed(2)} under`
    }
  }

  if (!isValidTotal.value) {
    return {
      type: 'warning',
      difference: `$${difference.value.toFixed(2)}`
    }
  }

  if (isValid.value) {
    return {
      type: 'success',
      difference: null
    }
  }

  return null
})

const getMaxAmountForSplit = (index: number): number => {
  if (!localSplits.value || localSplits.value.length === 0) {
    return Math.abs(props.transactionAmount)
  }

  if (index < 0 || index >= localSplits.value.length) {
    return Math.abs(props.transactionAmount)
  }

  const otherSplitsTotal = localSplits.value.reduce((sum, split, i) => {
    if (i === index) return sum
    return sum + (split.amount_debit || 0)
  }, 0)

  const absAmount = Math.abs(props.transactionAmount)
  const remaining = absAmount - otherSplitsTotal
  const maxAmount = Math.max(0, remaining)

  return Number(maxAmount.toFixed(2))
}

const addSplitDisabled = computed(() =>
  totalAmount.value >= absTransactionAmount.value
)

const addSplitHintText = computed(() => {
  if (!addSplitDisabled.value) return ''

  if (totalAmount.value > absTransactionAmount.value) {
    return '⚠️ Total exceeds transaction amount - reduce splits to fix error'
  } else if (localSplits.value.length === 1) {
    return 'Reduce the amount above to add additional splits'
  } else {
    return 'Totals match - reduce existing split amounts to add more'
  }
})

function updateSplitAmount(index: number, value: number | null | undefined) {
  if (index < 0 || index >= localSplits.value.length) return

  let newValue = 0
  if (value !== null && value !== undefined && !Number.isNaN(value)) {
    newValue = Number(value)
  }

  const split = localSplits.value[index]
  if (split) {
    split.amount_debit = newValue
  }

  // Trigger validation for this field
  formRef.value?.validateField(`splits.${index}.budget_category_id`)
}

function addSplit() {
  const remaining = absTransactionAmount.value - totalAmount.value

  const newSplit = {
    id: `${generateId()}`,
    budget_category_id: '',
    amount_debit: remaining > 0 ? Number(remaining.toFixed(2)) : 0
  }

  localSplits.value.push(newSplit)
}

function removeSplit(index: number) {
  if (localSplits.value.length <= 1) {
    ElMessage.warning('At least one split is required')
    return
  }

  localSplits.value.splice(index, 1)
}

async function handleBeforeClose(done: () => void) {
  if (isDirty.value) {
    try {
      const options: ElMessageBoxOptions = {
        confirmButtonText: 'Discard',
        cancelButtonText: 'Keep Editing',
        type: 'warning'
      }

      await ElMessageBox.confirm(
        'You have unsaved changes. Are you sure you want to close?',
        'Unsaved Changes',
        options
      )
      emit('cancel')
      done()
    } catch {
      // User clicked cancel, do nothing
    }
  } else {
    done()
  }
}

function handleCancel() {
  emit('cancel')
  visible.value = false
}

async function handleSubmit() {
  // Validate form first
  if (!formRef.value) return

  try {
    await formRef.value.validate()
  } catch {
    ElMessage.error('Please fix validation errors before saving')
    return
  }

  // Then check other business logic
  if (!isValid.value) {
    if (isOver.value) {
      ElMessage.error(`Splits exceed transaction amount by $${Math.abs(difference.value).toFixed(2)}`)
    } else if (!isValidTotal.value) {
      ElMessage.error(`Splits must total $${absTransactionAmount.value.toFixed(2)}`)
    }
    return
  }

  emit('submit', localSplits.value)
  visible.value = false
}
</script>

<style scoped lang="scss">
.split-drawer-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 20px;

  .validation-alert {
    .validation-content {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .difference {
        font-weight: 600;

        &.over-amount {
          color: var(--el-color-danger);
        }

        &:not(.over-amount) {
          color: var(--el-color-warning);
        }
      }
    }
  }

  .splits-form {
    flex: 1;
    overflow-y: auto;

    .splits-list {
      display: flex;
      flex-direction: column;
      gap: 14px;

      .split-row {
        display: grid;
        grid-template-columns: 1fr 180px 60px;
        gap: 12px;
        align-items: start;
        padding: 14px;
        border: 1px solid var(--el-border-color);
        border-radius: 4px;

        &:hover {
          background-color: var(--el-fill-color-light);
        }

        .split-category-field {
          margin-bottom: 0;
        }
      }
    }
  }

  .add-split-section {
    display: flex;
    align-items: center;
    gap: 12px;

    .hint {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
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