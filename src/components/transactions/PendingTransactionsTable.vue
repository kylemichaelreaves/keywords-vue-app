<template>
  <AlertComponent
    v-if="isError && error"
    :title="error.name"
    :message="error.message"
    type="error"
    data-testid="pending-transactions-table-error-alert"
  />

  <el-page-header>
    <template #content>
      <span class="text-large font-600 mr-3"> Pending Transactions </span>
    </template>
    <template #extra>
      <el-segmented
        v-model="viewMode"
        :options="viewOptions"
        data-testid="view-mode-segmented"
      />
    </template>
  </el-page-header>


  <el-dialog
    v-model="showTransactionEditModal"
    :close-on-click-modal="false"
    :before-close="closeTransactionEditModal"
    width="50%"
    :title="editModalTitle"
    data-testid="pending-transaction-edit-dialog"
  >
    <TransactionEditForm
      v-if="selectedTransaction"
      :transaction="selectedTransaction"
      :isPending="true"
      :pendingTransactionId="originalPendingTransaction?.id"
      @close="closeTransactionEditModal"
    />
  </el-dialog>

  <div @contextmenu.prevent>
    <!-- Show skeleton when loading -->
    <TableSkeleton
      v-if="isLoadingCondition"
      :columns="transactionColumns"
      :rows="LIMIT"
      data-testid="pending-transactions-table-skeleton"
    />

    <!-- Show actual table when not loading -->
    <el-table
      v-else-if="flattenedData && flattenedData.length >= 0"
      data-testid="pending-transactions-table"
      :row-key="getRowKey"
      :data="paginatedData"
      height="auto"
      size="small"
      border
      stripe
      show-summary
      show-overflow-tooltip
      @row-contextmenu="(row: PendingTransaction) => openTransactionEditModal(row)"
    >
      <el-table-column
        v-for="column in transactionColumns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
        :sortable="column.sortable"
        :data-testid="`column-${column.prop}`"
        width="auto"
      >
        <template v-slot:default="scope">
          <template v-if="column.prop === 'id'">
            <div :data-testid="`pending-transaction-id-${scope.row[column.prop]}`">
              {{ scope.row[column.prop] }}
            </div>
          </template>
          <template v-else-if="column.prop === 'transaction_date'">
            <div :data-testid="`date-cell-${scope.row[column.prop]}`">
              {{ formatDate(scope.row[column.prop]) }}
            </div>
          </template>
          <template v-else-if="column.prop === 'created_at'">
            <div :data-testid="`created-at-cell-${scope.row[column.prop]}`">
              {{ formatDate(scope.row[column.prop]) }}
            </div>
          </template>
          <template v-else-if="column.prop === 'reviewed_at'">
            <div :data-testid="`reviewed-at-cell-${scope.row[column.prop]}`">
              {{ scope.row[column.prop] ? formatDate(scope.row[column.prop]) : 'Not reviewed' }}
            </div>
          </template>
          <template v-else-if="column.prop === 'memo'">
            <router-link :to="`memos/${scope.row[column.prop]}/summary`" data-testid="memo-link">
              {{ scope.row[column.prop] }}
            </router-link>
          </template>
          <template v-else-if="column.prop === 'status'">
            <el-tag
              :type="
                scope.row[column.prop] === 'pending'
                  ? 'warning'
                  : scope.row[column.prop] === 'reviewed'
                    ? 'success'
                    : 'danger'
              "
              :data-testid="`status-cell-${scope.row[column.prop]}`"
            >
              {{ scope.row[column.prop] }}
            </el-tag>
          </template>
          <template v-else>
            {{ scope.row[column.prop] || 'N/A' }}
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <TransactionTablePagination v-if="!isPaginationDisabled" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { PendingTransaction, Transaction } from '@types'
import { formatDate } from '@api/helpers/formatDate'
import { useTransactionsStore } from '@stores/transactions'
import usePendingTransactions from '@api/hooks/transactions/usePendingTransactions'
import AlertComponent from '@components/shared/AlertComponent.vue'
import TransactionTablePagination from '@components/transactions/TransactionsTablePagination.vue'
import TransactionEditForm from '@components/transactions/TransactionEditForm.vue'
import TableSkeleton from '@components/shared/TableSkeleton.vue'
import { useRouter } from 'vue-router'

const store = useTransactionsStore()

const router = useRouter()

// Segmented control for view mode
const viewMode = computed({
  get: () => store.getSelectedStatus || '',
  set: (value: string) => {
    store.setSelectedStatus(value as 'pending' | 'reviewed')
    store.clearPendingTransactionsByOffset()
  }
})
const viewOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Reviewed', value: 'reviewed' }
]

const selectedMonth = computed(() => store.getSelectedMonth)
const selectedWeek = computed(() => store.getSelectedWeek)
const selectedDay = computed(() => store.getSelectedDay)

const showTransactionEditModal = ref(false)
const selectedTransaction = ref<Transaction | null>(null)
const originalPendingTransaction = ref<PendingTransaction | null>(null)

const openTransactionEditModal = (row: PendingTransaction) => {
  // Debug: Log the row data to see what we're receiving
  console.log('PendingTransaction row data:', row)
  console.log('transaction_data:', row.transaction_data)

  // Parse transaction_data if it's a string
  let transactionData: Transaction | null = null
  if (typeof row.transaction_data === 'string') {
    try {
      transactionData = JSON.parse(row.transaction_data)
    } catch (error) {
      console.error('Failed to parse transaction_data:', error)
    }
  } else {
    transactionData = row.transaction_data
  }

  console.log('Parsed transaction_data:', transactionData)

  // Extract the transaction data from the JSONB field and merge with pending transaction info
  const transactionFromData: Transaction = {
    id: row.id,
    transaction_number: transactionData?.transaction_number?.toString() || `PENDING-${row.id}`,
    date: transactionData?.date || '',
    description: transactionData?.description || '',
    memo: transactionData?.memo || '',
    amount_debit: transactionData?.amount_debit?.toString() || row.amount_debit || '0.00',
    amount_credit: transactionData?.amount_credit?.toString() || '0.00',
    balance: transactionData?.balance?.toString() || '',
    check_number: transactionData?.check_number || '',
    fees: transactionData?.fees?.toString() || '',
    budget_category: row.assigned_category || transactionData?.budget_category || ''
  }

  console.log('Constructed transaction for form:', transactionFromData)

  originalPendingTransaction.value = { ...row }
  selectedTransaction.value = transactionFromData

  console.log('Setting originalPendingTransaction.value.id:', originalPendingTransaction.value.id)
  console.log('Will pass isPending=true and pendingTransactionId:', originalPendingTransaction.value.id)

  showTransactionEditModal.value = true
}

const closeTransactionEditModal = () => {
  showTransactionEditModal.value = false
  selectedTransaction.value = null
  originalPendingTransaction.value = null
}

const editModalTitle = computed(() => {
  return selectedTransaction.value
    ? `Review Pending Transaction: ${selectedTransaction.value.id}`
    : 'Review Pending Transaction'
})

// disable the pagination if day, week, or month is selected
const isPaginationDisabled = computed(
  () => selectedDay.value || selectedWeek.value || selectedMonth.value
)

const LIMIT = computed(() => store.getTransactionsTableLimit)

const {
  data,
  error,
  isError,
  isLoading,
  isFetching,
  isFetchingNextPage,
  isFetchingPreviousPage,
  isRefetching,
  fetchNextPage,
  hasNextPage,
  refetch
} = usePendingTransactions()

// Watch for status changes and refetch data
watch(
  () => store.getSelectedStatus,
  () => {
    // Reset pagination when status changes
    store.updateTransactionsTableOffset(0)
    // Refetch the data with the new status
    refetch()
  }
)

const isLoadingCondition = computed(
  () =>
    isLoading.value ||
    isFetching.value ||
    isRefetching.value ||
    isFetchingNextPage.value ||
    isFetchingPreviousPage.value
)

const flattenedData = computed(() => {
  return data?.value?.pages.flat() || []
})

const currentPage = computed({
  get: () => Math.floor(store.transactionsTableOffset / store.transactionsTableLimit) + 1,
  set: (val: number) => {
    store.updateTransactionsTableOffset((val - 1) * store.transactionsTableLimit)
  }
})

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * LIMIT.value
  const end = start + LIMIT.value
  return flattenedData.value.slice(start, end)
})

const loadMorePagesIfNeeded = async () => {
  const requiredDataCount = currentPage.value * LIMIT.value
  while (flattenedData.value.length < requiredDataCount && hasNextPage.value) {
    await fetchNextPage()
  }
}

watch(
  currentPage,
  () => {
    loadMorePagesIfNeeded()
  },
  { immediate: true }
)

// Pending transaction columns definition based on the database schema
const transactionColumns = [
  { prop: 'id', label: 'ID', sortable: true },
  { prop: 'date', label: 'Date', sortable: true },
  { prop: 'transaction_data', label: 'Transaction Data', sortable: false },
  { prop: 'memo', label: 'Memo', sortable: true },
  { prop: 'amount_debit', label: 'Amount Debit', sortable: true },
  { prop: 'assigned_category', label: 'Assigned Category', sortable: true },
  { prop: 'status', label: 'Status', sortable: true },
  { prop: 'created_at', label: 'Created At', sortable: true },
  { prop: 'reviewed_at', label: 'Reviewed At', sortable: true }
]

const getRowKey = (row: PendingTransaction) => row.id
</script>
