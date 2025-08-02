<template>
  <DailyIntervalLineChart data-testid="daily-interval-line-chart" :first-day="firstDay" />
  <AlertComponent
    v-if="isError && error"
    :title="error.name"
    :message="error.message"
    type="error"
    data-testid="transactions-table-error-alert"
  />

  <MonthSummaryTable v-if="selectedMonth" data-testid="month-summary-table" />
  <WeekSummaryTable v-if="selectedWeek" data-testid="week-summary-table" />
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
      data-testid="transaction-edit-form"
    />
  </el-dialog>

  <div @contextmenu.prevent>
    <el-table
      data-testid="transactions-table"
      :row-key="getRowKey"
      v-if="flattenedData"
      v-loading="isLoadingCondition"
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
          <template v-if="column.prop === 'transaction_number'">
            <router-link
              :to="{name: 'transaction', params: {transactionNumber: scope.row[column.prop]}}"
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
          <template v-else-if="column.prop === 'memo'">
            <router-link :to="`memos/${scope.row[column.prop]}/summary`" data-testid="memo-link">
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
  <TransactionTablePagination v-if="!isPaginationDisabled" data-testid="transactions-table-pagination" />
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import type { Transaction } from '@types'
import { formatDate } from '@api/helpers/formatDate'
import MonthSummaryTable from '@components/transactions/MonthSummaryTable.vue'
import WeekSummaryTable from '@components/transactions/WeekSummaryTable.vue'
import { useTransactionsStore } from '@stores/transactions'
import useTransactions from '@api/hooks/transactions/useTransactions'
import TransactionsTableSelects from '@components/transactions/TransactionsTableSelects.vue'
import AlertComponent from '@components/shared/AlertComponent.vue'
import DailyIntervalLineChart from '@components/transactions/DailyIntervalLineChart.vue'
import TransactionTablePagination from '@components/transactions/TransactionsTablePagination.vue'
import { getTimeframeTypeAndValue } from '@components/transactions/getTimeframeTypeAndValue.ts'
import TransactionEditForm from '@components/transactions/TransactionEditForm.vue'
import useURLSync from '@composables/useURLSync.ts'


const store = useTransactionsStore()

const selectedMonth = computed(() => store.getSelectedMonth)
const selectedWeek = computed(() => store.getSelectedWeek)
const selectedDay = computed(() => store.getSelectedDay)

const firstDay = computed(() => {
  const days = store.getDays
  return days.length > 0 ? days[0].day : ''
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
const isPaginationDisabled = computed(() => selectedDay.value || selectedWeek.value || selectedMonth.value)

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
  refetch,
  fetchNextPage,
  hasNextPage
} = useTransactions()

const isLoadingCondition = reactive(
  isLoading ||
  isFetching ||
  isRefetching ||
  isFetchingNextPage ||
  isFetchingPreviousPage
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

watch(currentPage, () => {
  loadMorePagesIfNeeded()
})


useURLSync()


// this block allows the DailyIntervalLineChart to set the selectedDay and trigger a refetch
watch(
  [selectedValue],
  () => {
    store.clearTransactionsByOffset()
    refetch()
  },
  { immediate: false }
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
  { prop: 'budget_category', label: 'Budget Category', sortable: false }
]

function getRowKey(row: Transaction): string {
  return row.transaction_number ?? ''
}

</script>

<style scoped>
</style>