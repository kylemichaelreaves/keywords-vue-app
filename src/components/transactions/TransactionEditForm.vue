<template>
  <el-form :model="transaction" ref="formRef" label-width="120px" :data-testid="props.dataTestId">
    <el-form-item v-for="(field, key) in fields" :key="key" :label="field.label">
      <component
        :is="field.component"
        v-model="transaction[key]"
        :placeholder="field.placeholder"
        :data-testid="`${dataTestId}-${key}`"
        v-bind="field.props || {}"
      >
      </component>
    </el-form-item>
    <el-button type="primary" @click="saveTransaction" :data-testid="`${dataTestId}-save-button`">
      Save
    </el-button>
  </el-form>
</template>

<script setup lang="ts">
import { type PropType, reactive, ref, watch } from 'vue'
import type { Transaction, TransactionFormFields, TransactionKeys, PendingTransaction } from '@types'
import mutateTransaction from '@api/hooks/transactions/mutateTransaction'
import mutatePendingTransaction from '@api/hooks/transactions/mutatePendingTransaction'
import { type ElForm, ElMessage } from 'element-plus'
import BudgetCategoryTreeSelect from '@components/transactions/BudgetCategoriesTreeSelect.vue'
import MemoSelect from '@components/transactions/selects/MemoSelect.vue'

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

console.log('[TransactionEditForm] Initial transaction data:', {
  id: transaction.id,
  budget_category: transaction.budget_category,
  isPending: props.isPending,
  pendingTransactionId: props.pendingTransactionId,
})

const formRef = ref<InstanceType<typeof ElForm> | null>(null)

const fields: Record<TransactionKeys, TransactionFormFields> = {
  id: {
    component: 'el-input',
    label: 'Id',
    placeholder: 'Transaction Id',
    props: {
      disabled: true,
    },
    dataTestId: `${props.dataTestId}-id-input`,
  },
  transaction_number: {
    component: 'el-input',
    label: 'Transaction Number',
    placeholder: 'Enter a transaction number',
    props: {
      disabled: true,
    },
    dataTestId: `${props.dataTestId}-transaction_number-input`,
  },
  date: {
    component: 'el-date-picker',
    label: 'Date',
    placeholder: 'Select a date',
    props: {
      valueFormat: 'YYYY-MM-DD',
    },
    dataTestId: `${props.dataTestId}-date-picker`,
  },
  amount_debit: {
    component: 'el-input',
    label: 'Amount Debit',
    placeholder: 'Enter a debit amount',
    props: {
      disabled: !!transaction.amount_credit,
    },
    dataTestId: `${props.dataTestId}-amount_debit-input`,
  },
  amount_credit: {
    component: 'el-input',
    label: 'Amount Credit ',
    placeholder: 'Enter a credit amount',
    props: {
      disabled: !!transaction.amount_debit,
    },
    dataTestId: `${props.dataTestId}-amount_credit-input`,
  },
  description: {
    component: 'el-input',
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
    component: 'el-input',
    label: 'Balance',
    placeholder: 'Enter a balance',
    dataTestId: `${props.dataTestId}-balance-input`,
  },
  check_number: {
    component: 'el-input',
    label: 'Check Number',
    placeholder: 'Enter a check number',
    dataTestId: `${props.dataTestId}-check-number-input`,
    props: {
      disabled: transaction.description !== 'CHECK',
    },
  },
  budget_category: {
    component: BudgetCategoryTreeSelect,
    label: 'Budget Category',
    placeholder: 'Select a budget category',
    dataTestId: `${props.dataTestId}-budget_category-tree_select`,
  },
  fees: {
    component: 'el-input',
    label: 'Fees',
    placeholder: 'Enter fees',
    dataTestId: `${props.dataTestId}-fees-input`,
  },
}

const { mutate: mutateRegularTransaction } = mutateTransaction()
const { mutate: mutatePending } = mutatePendingTransaction()

// Watch for changes to budget_category specifically
watch(
  () => transaction.budget_category,
  (newValue, oldValue) => {
    console.log('[TransactionEditForm] budget_category changed:', {
      oldValue,
      newValue,
      transactionId: transaction.id,
      timestamp: new Date().toISOString()
    })
  }
)

watch(
  () => props.transaction,
  (newTransaction) => {
    console.log('[TransactionEditForm] Props transaction changed:', {
      budget_category: newTransaction.budget_category,
      transactionId: newTransaction.id
    })
    Object.assign(transaction, newTransaction)
  },
  {
    deep: true,
    immediate: true,
  },
)

const saveTransaction = () => {
  console.log('[TransactionEditForm] Save transaction called with:', {
    isPending: props.isPending,
    pendingTransactionId: props.pendingTransactionId,
    transaction: transaction,
    budget_category: transaction.budget_category,
  })

  if (props.isPending && props.pendingTransactionId) {
    console.log('[TransactionEditForm] Using pending transaction mutation')
    console.log('[TransactionEditForm] Sending budget_category value:', transaction.budget_category)

    // Map budget_category to assigned_category for pending transactions
    const pendingTransactionData: PendingTransaction = {
      id: props.pendingTransactionId,
      created_at: '', // This will be ignored by the API
      transaction_data: transaction as unknown as Transaction,
      amount_debit: transaction.amount_debit || '0.00',
      transaction_date: transaction.date,
      memo_name: transaction.memo,
      assigned_category: transaction.budget_category,
      status: 'reviewed', // Mark as reviewed when saving
    }

    console.log('[TransactionEditForm] Mapped pending transaction data:', pendingTransactionData)

    mutatePending(
      {
        pendingTransactionId: props.pendingTransactionId,
        pendingTransaction: pendingTransactionData,
      },
      {
        onSuccess: async () => {
          console.log('[TransactionEditForm] Pending transaction mutation completed, waiting for refetch...')
          // Wait a bit to ensure the query refetch completes
          await new Promise(resolve => setTimeout(resolve, 500))
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
        transaction: transaction,
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
