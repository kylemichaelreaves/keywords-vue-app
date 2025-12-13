<template>
  <AlertComponent
    v-if="isError && error"
    :title="error.name"
    :message="error.message"
    type="error"
    data-testid="transactions-table-error-alert"
  />

  <DailyIntervalLineChart :first-day="firstDay" />

  <MonthSummaryTable v-if="selectedMonth" />
  <WeekSummaryTable v-if="selectedWeek" />

  <TransactionsTableSelects data-testid="transactions-table-selects" />

  <el-dialog
    v-model="showTransactionEditModal"
    :close-on-click-modal="false"
    :before-close="closeTransactionEditModal"
    width="50%"
    :title="editModalTitle"
    data-testid="transaction-edit-dialog"
  >
    <TransactionEditForm
      v-if="selectedTransaction"
      :transaction="selectedTransaction"
      @close="closeTransactionEditModal"
    />
  </el-dialog>

  <div @contextmenu.prevent>
    <!-- Show skeleton when loading -->
    <TableSkeleton
      v-if="isLoadingCondition"
      :columns="transactionColumns"
      :rows="LIMIT"
      data-testid="transactions-table-skeleton"
    />

    <!-- Show actual table when not loading -->
    <el-table
      v-else-if="paginatedData.length"
      data-testid="transactions-table"
      :row-key="getRowKey"
      :data="paginatedData"
      height="auto"
      size="small"
      border
      stripe
      show-summary
      show-overflow-tooltip
      @row-contextmenu="(row: Transaction) => openTransactionEditModal(row)"
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
            <router-link
              :to="{ name: 'transaction-edit', params: { transactionId: scope.row[column.prop] } }"
              :data-testid="`transaction-link-${scope.row[column.prop]}`"
            >
              {{ scope.row[column.prop] }}
            </router-link>
          </template>
          <template v-else-if="column.prop === 'date'">
            <div :data-testid="`date-cell-${scope.row[column.prop]}`">
              {{ formatDate(scope.row[column.prop]) }}
            </div>
          </template>
          <template v-else-if="column.prop === 'memo_id'">
            <router-link
              v-if="scope.row[column.prop] && scope.row[column.prop].toString().trim()"
              :to="{ name: 'memo-summary', params: { memoId: scope.row[column.prop] } }"
              data-testid="memo-link"
            >
              {{ scope.row[column.prop] }}
            </router-link>
          </template>
          <template v-else>
            {{ scope.row[column.prop] }}
          </template>
        </template>
      </el-table-column>
    </el-table>
  </div>
  <TransactionTablePagination v-if="!isPaginationDisabled" />
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Transaction } from '@types'
import { formatDate } from '@api/helpers/formatDate'
import MonthSummaryTable from '@components/transactions/summaries/month/MonthSummaryTable.vue'
import WeekSummaryTable from '@components/transactions/summaries/week/WeekSummaryTable.vue'
import { useTransactionsStore } from '@stores/transactions'
import useTransactions from '@api/hooks/transactions/useTransactions'
import TransactionsTableSelects from '@components/transactions/TransactionsTableSelects.vue'
import AlertComponent from '@components/shared/AlertComponent.vue'
import DailyIntervalLineChart from '@components/transactions/DailyIntervalLineChart.vue'
import TransactionTablePagination from '@components/transactions/TransactionsTablePagination.vue'
import { getTimeframeTypeAndValue } from '@components/transactions/helpers/getTimeframeTypeAndValue.ts'
import TransactionEditForm from '@components/transactions/TransactionEditForm.vue'
import TableSkeleton from '@components/shared/TableSkeleton.vue'

const store = useTransactionsStore()

const selectedMonth = computed(() => store.getSelectedMonth)
const selectedWeek = computed(() => store.getSelectedWeek)
const selectedDay = computed(() => store.getSelectedDay)

const firstDay = computed(() => {
  const days = store.getDays
  if (days.length > 0) {
    return days[0]?.day
  }
  const now = new Date()
  const lastDayOfPreviousMonth = new Date(now.getFullYear(), now.getMonth(), 0)
  return lastDayOfPreviousMonth.toISOString().split('T')[0]
})

const dateTypeAndValue = computed(() => getTimeframeTypeAndValue())
const selectedValue = computed(() => dateTypeAndValue.value.selectedValue)

const showTransactionEditModal = ref(false)
const selectedTransaction = ref<Transaction | null>(null)

const openTransactionEditModal = (row: Transaction) => {
  selectedTransaction.value = { ...row }
  showTransactionEditModal.value = true
}

const closeTransactionEditModal = () => {
  showTransactionEditModal.value = false
  selectedTransaction.value = null
}

const editModalTitle = computed(() => {
  return selectedTransaction.value
    ? `Edit Transaction: ${selectedTransaction.value.transaction_number}`
    : 'Edit Transaction'
})

// disable the pagination if day, week, or month is selected
const isPaginationDisabled = computed(
  () => selectedDay.value || selectedWeek.value || selectedMonth.value,
)

const LIMIT = computed(() => store.getTransactionsTableLimit)
console.log('TransactionsTable LIMIT:', LIMIT.value)

const {
  data,
  error,
  isError,
  isLoading,
  isFetching,
  isFetchingNextPage,
  isFetchingPreviousPage,
  isRefetching,
  refetch,
  fetchNextPage,
  hasNextPage,
} = useTransactions()

const isLoadingCondition = computed(
  () =>
    isLoading.value ||
    isFetching.value ||
    isRefetching.value ||
    isFetchingNextPage.value ||
    isFetchingPreviousPage.value,
)

const flattenedData = computed(() => {
  if (!data?.value?.pages) {
    return []
  }
  const flattened = data.value.pages.flat()
  console.log('Flattened Data:', flattened)
  return flattened
})

console.log('Flattened Transactions Data:', flattenedData.value)

const currentPage = computed({
  get: () => Math.floor(store.transactionsTableOffset / store.transactionsTableLimit) + 1,
  set: (val: number) => {
    store.updateTransactionsTableOffset((val - 1) * store.transactionsTableLimit)
  },
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

watch(currentPage, () => {
  loadMorePagesIfNeeded()
})

// this block allows the DailyIntervalLineChart to set the selectedDay and trigger a refetch
watch(
  [selectedValue],
  () => {
    store.clearTransactionsByOffset()
    refetch()
  },
  { immediate: false },
)

// Define table columns
const transactionColumns = [
  { prop: 'id', label: 'ID', sortable: true },
  { prop: 'transaction_number', label: 'Transaction Number', sortable: true },
  { prop: 'date', label: 'Date', sortable: true },
  { prop: 'description', label: 'Description', sortable: false },
  { prop: 'memo_id', label: 'Memo ID', sortable: false },
  { prop: 'memo', label: 'Memo', sortable: false },
  { prop: 'amount_debit', label: 'Amount Debit', sortable: false },
  { prop: 'amount_credit', label: 'Amount Credit', sortable: false },
  { prop: 'balance', label: 'Balance', sortable: false },
  { prop: 'budget_category', label: 'Budget Category', sortable: false },
]

function getRowKey(row: Transaction): string {
  return row.transaction_number ?? ''
}
</script>
