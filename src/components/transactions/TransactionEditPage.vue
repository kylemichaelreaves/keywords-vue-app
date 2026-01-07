<template>
  <div class="transaction-edit-page">
    <el-page-header @back="goBack" :title="pageTitle" data-testid="transaction-edit-page-header">
      <template #content>
        <span class="text-large font-600 mr-3">Edit Transaction {{ transactionId }}</span>
      </template>
    </el-page-header>

    <AlertComponent
      v-if="isError && error"
      :title="(error as Error)?.name || 'Error'"
      :message="(error as Error)?.message || 'An error occurred while loading the transaction'"
      type="error"
      data-testid="transaction-edit-error-alert"
    />

    <div v-if="isLoading" class="loading-container" data-testid="transaction-edit-loading">
      <el-skeleton :rows="10" animated />
    </div>

    <TransactionEditForm
      v-else-if="transaction"
      :transaction="transaction"
      :data-test-id="'transaction-edit-page-form'"
      :is-pending="isPending"
      :pending-transaction-id="pendingTransactionId ? Number(pendingTransactionId) : undefined"
      @close="goBack"
    />

    <el-alert
      v-else-if="!isLoading && !transaction"
      title="Transaction Not Found"
      type="warning"
      description="The requested transaction could not be found."
      show-icon
      data-testid="transaction-not-found-alert"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, toValue } from 'vue'
import { useRouter } from 'vue-router'
import TransactionEditForm from '@components/transactions/TransactionEditForm.vue'
import AlertComponent from '@components/shared/AlertComponent.vue'
import useTransaction from '@api/hooks/transactions/useTransaction'
import type { PendingTransaction, Transaction } from '@types'

const props = defineProps({
  transactionId: {
    type: String,
    default: undefined,
  },
  pendingTransactionId: {
    type: String,
    default: undefined,
  },
})

const router = useRouter()

const isPending = computed(() => !!props.pendingTransactionId)
const entityId = computed(() => props.pendingTransactionId || props.transactionId)

// Fetch the specific transaction by ID
const {
  data: transactionData,
  isLoading,
  isError,
  error,
} = useTransaction(Number(entityId.value))

const transaction = computed(() => {
  const data = toValue(transactionData)
  if (!data) return null

  // Type guard to check if it's a PendingTransaction
  // We need to use unknown since Transaction and PendingTransaction don't overlap
  const isPendingTransaction = (obj: unknown): obj is PendingTransaction => {
    return (
      typeof obj === 'object' &&
      obj !== null &&
      'transaction_data' in obj &&
      'status' in obj
    )
  }

  // If it's a pending transaction, extract the transaction data from the transaction_data field
  if (isPending.value && isPendingTransaction(data)) {
    if (typeof data.transaction_data === 'string') {
      return JSON.parse(data.transaction_data) as Transaction
    }
    return data.transaction_data as Transaction
  }

  return data
})

const pageTitle = computed(() => {
  return isPending.value ? 'Edit Pending Transaction' : 'Edit Transaction'
})

const goBack = () => {
  router.back()
}
</script>

<style scoped>
.transaction-edit-page {
  padding: 20px;
}

.loading-container {
  margin-top: 20px;
}
</style>
