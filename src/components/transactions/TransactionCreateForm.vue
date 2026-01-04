<template>
  <el-form :model="formState" v-loading="isPending" data-testid="transaction-form">
    <AlertComponent
      v-if="isError && error"
      :title="error.name"
      :message="error.message"
      type="error"
      data-testid="transaction-form-error-alert"
    />
    <el-switch
      active-text="Debit"
      inactive-text="Credit"
      v-model="isDebit"
      data-testid="transaction-type-switch"
    />
    <el-form-item
      v-for="(field, key) in fields"
      :key="key"
      :label="field.label"
      :data-testid="`transaction-form-item-${key}`"
    >
      <component
        :is="field.component"
        v-model="formState[key as keyof Transaction]"
        :placeholder="field.placeholder"
        :data-testid="`transaction-input-${key}`"
        v-bind="getFieldProps(field)"
      />
    </el-form-item>
    <el-button
      type="primary"
      @click="saveTransaction"
      data-testid="transaction-submit-button"
      :loading="isPending"
    >
      {{ isPending ? 'Creating...' : 'Create Transaction' }}
    </el-button>
  </el-form>
</template>

<script setup lang="ts">
import {type Component, computed, reactive, ref} from 'vue'
import { useMutation } from '@tanstack/vue-query'
import { createTransaction } from '@api/transactions/createTransaction.ts'
import {ElDatePicker, ElMessage} from 'element-plus'
import type { Transaction } from '@types'
import AlertComponent from '@components/shared/AlertComponent.vue'

interface FormField {
  component: string | Component
  label: string
  placeholder?: string
  props?: Record<string, unknown>
  computedProps?: () => Record<string, unknown>
}

const isDebit = ref(true)
const formState = reactive<Transaction>({
  date: '',
  description: '',
  memo: '',
  amount_debit: '',
  amount_credit: '',
})

// mutation for creating transactions
const { isPending, isError, error, mutate } = useMutation({
  mutationFn: ({ transaction }: { transaction: Transaction }) => createTransaction(transaction),
  onSuccess: () => {
    // Reset form state after successful mutation
    Object.assign(formState, {
      date: '',
      description: '',
      memo: '',
      amount_debit: '',
      amount_credit: '',
    })
    ElMessage.success('Transaction created')
  },
  onError: (error) => {
    ElMessage.error(error.message)
  },
})

const saveTransaction = () => {
  // Validate form state before mutation
  if (!formState.date || (!formState.amount_debit && !formState.amount_credit)) {
    ElMessage.error('Please fill in all required fields')
    return
  }

  const transactionData: Transaction = {
    ...formState,
    amount_debit: formState.amount_debit,
    amount_credit: formState.amount_credit,
  }

  mutate({ transaction: transactionData })
}

const fieldConfig: Record<
  keyof Pick<Transaction, 'date' | 'description' | 'memo' | 'amount_debit' | 'amount_credit'>,
  FormField
> = {
  date: {
    component: ElDatePicker,
    label: 'Date',
    placeholder: 'Select a date',
    props: {
      valueFormat: 'YYYY-MM-DD',
    },
  },
  description: {
    component: ElInput,
    label: 'Description',
    placeholder: 'Enter description',
  },
  memo: {
    component: ElInput,
    label: 'Memo',
    placeholder: 'Enter memo',
  },
  amount_debit: {
    component: ElInput,
    label: 'Amount Debit',
    placeholder: 'Enter debit amount',
    computedProps: () => ({
      disabled: !isDebit.value,
    }),
  },
  amount_credit: {
    component: ElInput,
    label: 'Amount Credit',
    placeholder: 'Enter credit amount',
    computedProps: () => ({
      disabled: isDebit.value,
    }),
  },
}

// Make fields reactive and available to template
const fields = computed(() => fieldConfig)

// Helper function to merge static and computed props
const getFieldProps = (field: FormField) => {
  const staticProps = field.props || {}
  const computedProps = field.computedProps ? field.computedProps() : {}
  return { ...staticProps, ...computedProps }
}
</script>

<style scoped></style>
