<template>
  <el-form :model="transaction" ref="formRef" label-width="120px" :data-testid="dataTestId">
    <el-form-item v-for="(field, key) in fields" :key="key" :label="field.label">
      <component
        :is="field.component"
        v-model="formValues[key]"
        :placeholder="field.placeholder"
        :data-testid="`${dataTestId}-${key}`"
        v-bind="field.props || {}"
      />
    </el-form-item>

    <el-button type="primary" @click="saveTransaction">
      Save
    </el-button>
  </el-form>
</template>

<script setup lang="ts">
import { type PropType, reactive, ref, watch, computed } from 'vue'
import type {
  Transaction,
  TransactionFormFields,
  PendingTransaction,
  BudgetCategoryState,
  SplitBudgetCategory,
  TransactionKeys
} from '@types'
import mutateTransaction from '@api/hooks/transactions/mutateTransaction'
import mutatePendingTransaction from '@api/hooks/transactions/mutatePendingTransaction'
import { type ElForm, ElMessage, ElInput, ElDatePicker } from 'element-plus'
import MemoSelect from '@components/transactions/selects/MemoSelect.vue'
import BudgetCategoryFormField from '@components/transactions/BudgetCategoryFormField.vue'

const props = defineProps({
  transaction: {
    type: Object as PropType<Transaction>,
    required: true
  },
  dataTestId: {
    type: String,
    default: 'transaction-edit-form'
  },
  isPending: {
    type: Boolean,
    default: false
  },
  pendingTransactionId: {
    type: Number,
    default: undefined
  }
})

const emit = defineEmits<{
  close: []
}>()

const formRef = ref<InstanceType<typeof ElForm> | null>(null)
const transaction = reactive<Transaction>(props.transaction as Transaction)

// Budget category state - single source of truth
const budgetCategoryState = ref<BudgetCategoryState>(
  initializeBudgetCategoryState(props.transaction!)
)

// Computed transaction amount
const transactionAmount = computed(() =>
  Number.parseFloat(transaction.amount_debit || transaction.amount_credit || '0')
)

// Initialize budget category state from transaction
function initializeBudgetCategoryState(txn: Transaction): BudgetCategoryState {
  if (txn.is_split && Array.isArray(txn.budget_category)) {
    return {
      mode: 'split',
      splits: txn.budget_category.map((split, index) => ({
        id: `split_${index}_${Date.now()}`,
        budget_category_id: split.budget_category_id,
        amount_debit: split.amount_debit
      }))
    }
  }

  return {
    mode: 'single',
    categoryId: typeof txn.budget_category === 'string' ? txn.budget_category : null
  }
}

// Reactive computed that creates proper getter/setters for each field
const formValues = computed(() => {
  const values: Record<string, unknown> = {}

  // Create getter/setter for each field
  const keys = Object.keys(fields) as TransactionKeys[]

  keys.forEach(key => {
    Object.defineProperty(values, key, {
      get() {
        if (key === 'budget_category') {
          return budgetCategoryState.value
        }
        return transaction[key]
      },
      set(value) {
        if (key === 'budget_category') {
          budgetCategoryState.value = value as BudgetCategoryState
        } else {
          transaction[key] = value
        }
      },
      enumerable: true,
      configurable: true
    })
  })

  return values
})

const fields: Record<TransactionKeys, TransactionFormFields> = {
  id: {
    component: ElInput,
    label: 'Id',
    placeholder: 'Transaction Id',
    props: { disabled: true }
  },
  transaction_number: {
    component: ElInput,
    label: 'Transaction Number',
    placeholder: 'Enter a transaction number',
    props: { disabled: true }
  },
  date: {
    component: ElDatePicker,
    label: 'Date',
    placeholder: 'Select a date',
    props: { valueFormat: 'YYYY-MM-DD' }
  },
  amount_debit: {
    component: ElInput,
    label: 'Amount Debit',
    placeholder: 'Enter a debit amount',
    props: { disabled: !!transaction.amount_credit }
  },
  amount_credit: {
    component: ElInput,
    label: 'Amount Credit',
    placeholder: 'Enter a credit amount',
    props: { disabled: !!transaction.amount_debit }
  },
  description: {
    component: ElInput,
    label: 'Description',
    placeholder: 'Enter a description'
  },
  memo: {
    component: MemoSelect,
    label: 'Memo',
    placeholder: 'Select a memo',
    props: { modelValue: transaction.memo }
  },
  balance: {
    component: ElInput,
    label: 'Balance',
    placeholder: 'Enter a balance'
  },
  check_number: {
    component: ElInput,
    label: 'Check Number',
    placeholder: 'Enter a check number',
    props: { disabled: transaction.description !== 'CHECK' }
  },
  budget_category: {
    component: BudgetCategoryFormField,
    label: 'Budget Category',
    placeholder: 'Select a budget category',
    props: {
      transactionAmount: transactionAmount.value,
    }
  },
  fees: {
    component: ElInput,
    label: 'Fees',
    placeholder: 'Enter fees'
  }
}

const { mutate: mutateRegularTransaction } = mutateTransaction()
const { mutate: mutatePending } = mutatePendingTransaction()

// Helper functions to extract values from discriminated union
function getBudgetCategory(state: BudgetCategoryState): string | SplitBudgetCategory[] | undefined {
  if (state.mode === 'single') {
    return state.categoryId ?? undefined
  }
  return state.splits
}

// Watch for external transaction changes
watch(
  () => props.transaction,
  (newTransaction) => {
    Object.assign(transaction, newTransaction)
    budgetCategoryState.value = initializeBudgetCategoryState(newTransaction!)
  },
  { deep: true }
)

// Save transaction
const saveTransaction = () => {
  const state = budgetCategoryState.value
  const budgetCategory = getBudgetCategory(state)

  const transactionData: Transaction = {
    ...transaction,
    budget_category: budgetCategory,
    is_split: state.mode === 'split'
  }

  if (props.isPending && props.pendingTransactionId) {
    const assignedCategory = getBudgetCategory(state)

    const pendingTransactionData: PendingTransaction = {
      id: props.pendingTransactionId,
      created_at: '',
      transaction_data: transactionData as unknown as Transaction,
      amount_debit: transaction.amount_debit || '0.00',
      transaction_date: transaction.date,
      memo_name: transaction.memo,
      assigned_category: assignedCategory,
      status: 'reviewed'
    }

    mutatePending(
      {
        pendingTransactionId: props.pendingTransactionId,
        pendingTransaction: pendingTransactionData
      },
      {
        onSuccess: () => {
          ElMessage.success('Pending transaction saved')
          emit('close')
        },
        onError: (error) => {
          ElMessage.error(error.message)
        }
      }
    )
  } else {
    mutateRegularTransaction(
      { transaction: transactionData },
      {
        onSuccess: () => {
          ElMessage.success('Transaction saved')
          emit('close')
        },
        onError: (error) => {
          ElMessage.error(error.message)
        }
      }
    )
  }
}
</script>