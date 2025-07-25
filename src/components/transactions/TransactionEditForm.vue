<template>
  <el-form
    :model="transaction"
    ref="formRef"
    label-width="120px"
    :data-testid="props.dataTestId"
  >
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
    <el-button
      type="primary"
      @click="saveTransaction"
      :data-testid="`${dataTestId}-save-button`"
    >
      Save
    </el-button>
  </el-form>
</template>

<script setup lang="ts">
import { type PropType, reactive, ref, watch } from 'vue'
import type { Transaction, TransactionFormFields, TransactionKeys } from '@types'
import mutateTransaction from '@api/hooks/transactions/mutateTransaction'
import { type ElForm, ElMessage } from 'element-plus'
import BudgetCategoryTreeSelect from '@components/transactions/BudgetCategoriesTreeSelect.vue'
import MemoSelect from '@components/transactions/MemoSelect.vue'

const props = defineProps({
  transaction: {
    type: Object as PropType<Transaction>,
    required: true
  },
  dataTestId: {
    type: String,
    default: 'transaction-edit-form'
  }
})

console.log('TransactionEditForm props', props.transaction)

const transaction = reactive({ ...props.transaction })

const formRef = ref<InstanceType<typeof ElForm> | null>(null)

const fields: Record<TransactionKeys, TransactionFormFields> = ({
  transaction_number: {
    component: 'el-input',
    label: 'Transaction Number',
    placeholder: 'Enter a transaction number',
    props: {
      disabled: true
    },
    dataTestId: `${props.dataTestId}-transaction_number-input`
  },
  date: {
    component: 'el-date-picker',
    label: 'Date',
    placeholder: 'Select a date',
    props: {
      valueFormat: 'YYYY-MM-DD'
    },
    dataTestId: `${props.dataTestId}-date-picker`
  },
  amount_debit: {
    component: 'el-input',
    label: 'Amount Debit',
    placeholder: 'Enter a debit amount',
    props: {
      disabled: !!transaction.amount_credit
    },
    dataTestId: `${props.dataTestId}-amount_debit-input`
  },
  amount_credit: {
    component: 'el-input',
    label: 'Amount Credit ',
    placeholder: 'Enter a credit amount',
    props: {
      disabled: !!transaction.amount_debit
    },
    dataTestId: `${props.dataTestId}-amount_credit-input`
  },
  description: {
    component: 'el-input',
    label: 'Description',
    placeholder: 'Enter a description',
    dataTestId: `${props.dataTestId}-description-input`
  },
  memo: {
    component: MemoSelect,
    label: 'Memo',
    placeholder: 'Select a memo',
    props: {
      modelValue: transaction.memo
    },
    dataTestId: `${props.dataTestId}-memo-select`
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
      disabled: transaction.description !== 'CHECK'
    },
  },
  budget_category: {
    component: BudgetCategoryTreeSelect,
    label: 'Budget Category',
    placeholder: 'Select a budget category',
    dataTestId: `${props.dataTestId}-budget_category-tree-select`,
  },
  fees: {
    component: 'el-input',
    label: 'Fees',
    placeholder: 'Enter fees',
    dataTestId: `${props.dataTestId}-fees-input`
  }
})

const { mutate } = mutateTransaction()

watch(() => props.transaction, (newTransaction) => {
  Object.assign(transaction, newTransaction)
}, {
  deep: true,
  immediate: true
})

const saveTransaction = () => {
  mutate({
      transaction: transaction
    },
    {
      onSuccess: () => {
        ElMessage.success('Transaction saved')
      },
      onError: (error) => {
        ElMessage.error(error.message)
      }
    })
}

</script>

<style scoped>
</style>