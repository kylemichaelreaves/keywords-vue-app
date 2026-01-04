<template>
  <el-form :model="transaction" ref="formRef" label-width="120px" :data-testid="props.dataTestId">
    <el-form-item v-for="(field, key) in fields" :key="key" :label="field.label">
      <component
        :is="field.component"
        v-model="transaction[key]"
        :placeholder="field.placeholder"
        :data-testid="`${dataTestId}-${key}`"
        v-bind="field.props || {}"
        @update:splits="handleSplitsUpdate"
        @update:is-split="handleIsSplitUpdate"
      >
      </component>
    </el-form-item>

    <el-button type="primary" @click="saveTransaction" :data-testid="`${dataTestId}-save-button`">
      Save
    </el-button>
  </el-form>
</template>

<script setup lang="ts">
import { type PropType, reactive, ref, watch, computed } from 'vue'
import type {
  Transaction,
  TransactionFormFields,
  TransactionKeys,
  PendingTransaction,
} from '@types'
import mutateTransaction from '@api/hooks/transactions/mutateTransaction'
import mutatePendingTransaction from '@api/hooks/transactions/mutatePendingTransaction'
import {type ElForm, ElMessage, ElInput, ElDatePicker} from 'element-plus'
import MemoSelect from '@components/transactions/selects/MemoSelect.vue'
import BudgetCategoryFormField from '@components/transactions/BudgetCategoryFormField.vue'

interface SplitCategory {
  id: string
  budget_category_id: number | null
  amount_debit: number | null
}

const props = defineProps({
  transaction: {
    type: Object as PropType<Transaction>,
    required: true,
  },
  dataTestId: {
    type: String,
    default: 'transaction-edit-form',
  },
  isPending: {
    type: Boolean,
    default: false,
  },
  pendingTransactionId: {
    type: Number,
    default: undefined,
  },
})

const emit = defineEmits<(e: 'close') => void>()

const transaction = reactive({ ...props.transaction })
const splitCategories = ref<SplitCategory[]>([])
const isSplitTransaction = ref(false)

console.log('[TransactionEditForm] Initial transaction data:', {
  id: transaction.id,
  budget_category: transaction.budget_category,
  isPending: props.isPending,
  pendingTransactionId: props.pendingTransactionId,
})

const formRef = ref<InstanceType<typeof ElForm> | null>(null)

// Computed property for transaction amount (debit or credit)
const transactionAmount = computed(() => {
  return Number.parseFloat(transaction.amount_debit || transaction.amount_credit || '0')
})

const fields: Record<TransactionKeys, TransactionFormFields> = {
  id: {
    component: ElInput,
    label: 'Id',
    placeholder: 'Transaction Id',
    props: {
      disabled: true,
    },
    dataTestId: `${props.dataTestId}-id-input`,
  },
  transaction_number: {
    component: ElInput,
    label: 'Transaction Number',
    placeholder: 'Enter a transaction number',
    props: {
      disabled: true,
    },
    dataTestId: `${props.dataTestId}-transaction_number-input`,
  },
  date: {
    component: ElDatePicker,
    label: 'Date',
    placeholder: 'Select a date',
    props: {
      valueFormat: 'YYYY-MM-DD',
    },
    dataTestId: `${props.dataTestId}-date-picker`,
  },
  amount_debit: {
    component: ElInput,
    label: 'Amount Debit',
    placeholder: 'Enter a debit amount',
    props: {
      disabled: !!transaction.amount_credit,
    },
    dataTestId: `${props.dataTestId}-amount_debit-input`,
  },
  amount_credit: {
    component: ElInput,
    label: 'Amount Credit ',
    placeholder: 'Enter a credit amount',
    props: {
      disabled: !!transaction.amount_debit,
    },
    dataTestId: `${props.dataTestId}-amount_credit-input`,
  },
  description: {
    component: ElInput,
    label: 'Description',
    placeholder: 'Enter a description',
    dataTestId: `${props.dataTestId}-description-input`,
  },
  memo: {
    component: MemoSelect,
    label: 'Memo',
    placeholder: 'Select a memo',
    props: {
      modelValue: transaction.memo,
    },
    dataTestId: `${props.dataTestId}-memo-select`,
  },
  balance: {
    component: ElInput,
    label: 'Balance',
    placeholder: 'Enter a balance',
    dataTestId: `${props.dataTestId}-balance-input`,
  },
  check_number: {
    component: ElInput,
    label: 'Check Number',
    placeholder: 'Enter a check number',
    dataTestId: `${props.dataTestId}-check-number-input`,
    props: {
      disabled: transaction.description !== 'CHECK',
    },
  },
  budget_category: {
    component: BudgetCategoryFormField,
    label: 'Budget Category',
    placeholder: 'Select a budget category',
    props: {
      splits: splitCategories.value,
      transactionAmount: transactionAmount.value,
    },
    dataTestId: `${props.dataTestId}-budget_category`,
  },
  fees: {
    component: ElInput,
    label: 'Fees',
    placeholder: 'Enter fees',
    dataTestId: `${props.dataTestId}-fees-input`,
  },
}

const { mutate: mutateRegularTransaction } = mutateTransaction()
const { mutate: mutatePending } = mutatePendingTransaction()

// Initialize splits from transaction if it has split_budget_categories
watch(
  () => props.transaction,
  (newTransaction) => {
    console.log('[TransactionEditForm] Props transaction changed:', {
      budget_category: newTransaction.budget_category,
      transactionId: newTransaction.id,
    })
    Object.assign(transaction, newTransaction)

    // Initialize splits if they exist in the transaction
    if (
      newTransaction?.is_split &&
      Array.isArray(newTransaction.budget_category)
    ) {
      splitCategories.value = newTransaction.budget_category.map(
        (split: any, index: number) => ({
          id: `split_${index}_${Date.now()}`,
          budget_category_id: split.budget_category_id,
          amount_debit: split.amount_debit,
        }),
      )
      isSplitTransaction.value = true
    }
  },
  {
    deep: true,
    immediate: true,
  },
)

// Watch for changes to budget_category specifically
watch(
  () => transaction.budget_category,
  (newValue, oldValue) => {
    console.log('[TransactionEditForm] budget_category changed:', {
      oldValue,
      newValue,
      transactionId: transaction.id,
      timestamp: new Date().toISOString(),
    })
  },
)

// Handle splits update from BudgetCategoryFormField
const handleSplitsUpdate = (splits: SplitCategory[]) => {
  splitCategories.value = splits
  // Update the props for the budget_category field
  fields.budget_category.props = {
    splits: splitCategories.value,
    transactionAmount: transactionAmount.value,
  }
}

// Handle is_split toggle
const handleIsSplitUpdate = (value: boolean) => {
  isSplitTransaction.value = value
}

const saveTransaction = () => {
  console.log('[TransactionEditForm] Save transaction called with:', {
    isPending: props.isPending,
    pendingTransactionId: props.pendingTransactionId,
    transaction: transaction,
    budget_category: transaction.budget_category,
    isSplit: isSplitTransaction.value,
    splitCategories: splitCategories.value,
  })

  // Prepare transaction data with splits if applicable
  const transactionData = {
    ...transaction,
    split_budget_categories:
      isSplitTransaction.value && splitCategories.value.length > 0 ? splitCategories.value : null,
  }

  if (props.isPending && props.pendingTransactionId) {
    console.log('[TransactionEditForm] Using pending transaction mutation')

    const pendingTransactionData: PendingTransaction = {
      id: props.pendingTransactionId,
      created_at: '',
      transaction_data: transactionData as unknown as Transaction,
      amount_debit: transaction.amount_debit || '0.00',
      transaction_date: transaction.date,
      memo_name: transaction.memo,
      assigned_category: transaction.budget_category,
      status: 'reviewed',
    }

    console.log('[TransactionEditForm] Mapped pending transaction data:', pendingTransactionData)

    mutatePending(
      {
        pendingTransactionId: props.pendingTransactionId,
        pendingTransaction: pendingTransactionData,
      },
      {
        onSuccess: async () => {
          console.log('[TransactionEditForm] Pending transaction mutation completed')
          await new Promise((resolve) => setTimeout(resolve, 500))
          ElMessage.success('Pending transaction saved')
          emit('close')
        },
        onError: (error) => {
          console.error('[TransactionEditForm] Pending transaction mutation error:', error)
          ElMessage.error(error.message)
        },
      },
    )
  } else {
    console.log('[TransactionEditForm] Using regular transaction mutation')
    mutateRegularTransaction(
      {
        transaction: transactionData,
      },
      {
        onSuccess: () => {
          ElMessage.success('Transaction saved')
          emit('close')
        },
        onError: (error) => {
          console.error('[TransactionEditForm] Regular transaction mutation error:', error)
          ElMessage.error(error.message)
        },
      },
    )
  }
}
</script>
