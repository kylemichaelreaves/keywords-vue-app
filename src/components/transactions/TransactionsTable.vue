<template>
  <DailyIntervalLineChart />

  <AlertComponent v-if="isError && error" :title="error.name" :message="error.message" type="error" />

  <MonthSummaryTable v-if="selectedMonth" />

  <WeekSummaryTable v-if="selectedWeek" />

  <TransactionsTableSelects />

  <el-table
    data-testid="transactions-table"
    :row-key="getRowKey"
    v-if="flattenedData"
    v-loading="isLoadingCondition"
    :data="paginatedData"
    table-layout="auto"
    height="auto"
    size="small"
    border
    stripe
    show-summary
  >
    <el-table-column
      v-for="column in transactionColumns"
      :key="column.prop"
      :prop="column.prop"
      :label="column.label"
      :sortable="column.sortable"
    >
      <template v-slot:default="scope">
        <template v-if="column.prop === 'transaction_number'">
          <router-link :to="{name: 'transaction', params: {transactionNumber: scope.row[column.prop]}}">
            {{ scope.row[column.prop] }}
          </router-link>
        </template>
        <template v-else-if="column.prop === 'date'">
          <div>
            {{ formatDate(scope.row[column.prop]) }}
          </div>
        </template>
        <template v-else-if="column.prop === 'memo'">
          <router-link :to="`memos/${scope.row[column.prop]}`">
            {{ scope.row[column.prop] }}
          </router-link>
        </template>
        <!-- TODO if the column is budget_category, display the budgetCategoryTreeSelect component -->
        <template v-else>
          {{ scope.row[column.prop] }}
        </template>
      </template>
    </el-table-column>
  </el-table>
  <TransactionTablePagination v-if="!isPaginationDisabled" />
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
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
import { getDateTypeAndValue } from '@components/transactions/getDateTypeAndValue'

const store = useTransactionsStore()

const selectedMonth = computed(() => store.getSelectedMonth)
const selectedWeek = computed(() => store.getSelectedWeek)
const selectedDay = computed(() => store.getSelectedDay)

const dateTypeAndValue = computed(() => getDateTypeAndValue())
const selectedValue = computed(() => dateTypeAndValue.value.selectedValue)

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

// this block allows the DailyIntervalLineChart to set the selectedDay and trigger a refetch
watch(
  [selectedValue],
  () => {
    store.clearTransactionsByOffset()
    refetch()
  },
  { immediate: true }
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
  return row.transactionNumber
}

</script>

<style scoped>
</style>