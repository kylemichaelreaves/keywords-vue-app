<template>
  <div class="transaction-edit-page">
    <el-page-header @back="goBack" :title="pageTitle" data-testid="transaction-edit-page-header">
      <template #content>
        <span class="text-large font-600 mr-3">Edit Transaction {{ transactionId }}</span>
      </template>
    </el-page-header>

    <AlertComponent
      v-if="isError && error"
      :title="error.name"
      :message="error.message"
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
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import TransactionEditForm from '@components/transactions/TransactionEditForm.vue'
import AlertComponent from '@components/shared/AlertComponent.vue'
import useTransaction from '@api/hooks/transactions/useTransaction'

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
  if (!transactionData.value) return null

  // If it's a pending transaction, extract the transaction data from the transaction_data field
  if (isPending.value && transactionData.value) {
    const pendingTxn = transactionData.value as any
    if (typeof pendingTxn.transaction_data === 'string') {
      return JSON.parse(pendingTxn.transaction_data)
    }
    return pendingTxn.transaction_data
  }

  return transactionData.value
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
