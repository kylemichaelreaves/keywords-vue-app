<template>
  <div class="bv-transactions">
    <AlertComponent
      v-if="isError && error"
      :title="error.name"
      :message="error.message"
      type="error"
      data-testid="transactions-table-error-alert"
    />

    <section class="bv-summary-cards" data-testid="transactions-summary-cards">
      <el-card class="bv-stat-card" shadow="never">
        <el-statistic
          title="Total Credits"
          :value="totalCredits"
          prefix="$"
          :precision="2"
          data-testid="total-credits-stat"
        />
      </el-card>
      <el-card class="bv-stat-card" shadow="never">
        <el-statistic
          title="Total Debits"
          :value="totalDebits"
          prefix="$"
          :precision="2"
          data-testid="total-debits-stat"
        />
      </el-card>
      <el-card class="bv-stat-card" shadow="never">
        <el-statistic
          title="Top Budget Category"
          :value="topBudgetCategory"
          data-testid="top-budget-category-stat"
        />
      </el-card>
    </section>

    <section class="bv-section bv-chart-section">
      <DailyIntervalLineChart :first-day="firstDay" />
    </section>

    <MonthSummaryTable v-if="selectedMonth" />
    <WeekSummaryTable v-if="selectedWeek" />

    <section class="bv-section bv-filters-section">
      <TransactionsTableSelects data-testid="transactions-table-selects" />
    </section>

    <el-dialog
      v-model="showTransactionEditModal"
      :close-on-click-modal="false"
      :before-close="closeTransactionEditModal"
      width="min(640px, 94vw)"
      :title="editModalTitle"
      data-testid="transaction-edit-dialog"
      aria-label="Transaction Edit Modal"
    >
      <template #header>
        <span
          aria-label="Transaction Edit Dialog Title"
          data-testid="transaction-edit-dialog-title"
        >
          {{ editModalTitle }}
        </span>
      </template>
      <TransactionEditForm
        aria-label="Transaction Edit Form"
        v-if="selectedTransaction"
        :transaction="selectedTransaction"
        @close="closeTransactionEditModal"
      />
    </el-dialog>

    <section class="bv-section bv-table-section" @contextmenu.prevent>
      <TableSkeleton
        v-if="isLoadingCondition"
        :columns="transactionColumns"
        :rows="LIMIT"
        data-testid="transactions-table-skeleton"
      />

      <el-table
        v-else-if="paginatedData.length"
        class="bv-table"
        data-testid="transactions-table"
        aria-label="Transactions Table"
        :row-key="getRowKey"
        :data="paginatedData"
        height="auto"
        size="small"
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
                class="bv-link"
                :to="{
                  name: 'transaction-edit',
                  params: { transactionId: scope.row[column.prop] },
                }"
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
                class="bv-link"
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
    </section>

    <div class="bv-pagination-row" v-if="!isPaginationDisabled">
      <TransactionTablePagination />
    </div>
  </div>
</template>

<script setup lang="ts">
import { devConsole } from '@utils/devConsole'

import { computed, ref, watch } from 'vue'
import type { Transaction } from '@types'
import { formatDate } from '@api/helpers/formatDate'
import MonthSummaryTable from '@components/transactions/summaries/month/MonthSummaryTable.vue'
import WeekSummaryTable from '@components/transactions/summaries/week/WeekSummaryTable.vue'
import { useTransactionsStore } from '@stores/transactions'
import useTransactions from '@api/hooks/transactions/useTransactions'
import TransactionsTableSelects from '@components/transactions/selects/TransactionsTableSelects.vue'
import AlertComponent from '@components/shared/AlertComponent.vue'
import DailyIntervalLineChart from '@components/transactions/charts/DailyIntervalLineChart/DailyIntervalLineChart.vue'
import TransactionTablePagination from '@components/transactions/TransactionsTablePagination.vue'
import TransactionEditForm from '@components/transactions/TransactionEditForm.vue'
import TableSkeleton from '@components/shared/TableSkeleton.vue'

const store = useTransactionsStore()

const selectedMonth = computed(() => store.getSelectedMonth)
const selectedWeek = computed(() => store.getSelectedWeek)
const selectedDay = computed(() => store.getSelectedDay)
const selectedMemo = computed(() => store.getSelectedMemo)

const firstDay = computed(() => {
  // first, get the most recent month in the store
  const store = useTransactionsStore()
  const months = store.getMonths
  devConsole('log', '[TransactionsTable DEBUG] No days found, checking months:', months)
  if (months.length > 0) {
    // Get the FIRST month in the array (earliest date) - e.g., "11/2025"
    const firstMonth = months[0]?.month_year
    devConsole('log', '[TransactionsTable DEBUG] First month from store:', firstMonth)

    if (firstMonth && typeof firstMonth === 'string') {
      // Parse month_year format "MM/YYYY" to get the first day of that month
      const [monthStr, yearStr] = firstMonth.split('/')

      if (monthStr && yearStr) {
        const month = Number.parseInt(monthStr, 10)
        const year = Number.parseInt(yearStr, 10)

        // Create date for the FIRST day of that month
        const firstDayOfMonth = new Date(year, month - 1, 1) // month is 1-based in MM/YYYY format
        const fallback = firstDayOfMonth.toISOString().split('T')[0]
        devConsole('log', '[TransactionsTable DEBUG] firstDay from first month in store:', fallback)
        return fallback
      }
    }
  }

  // Final fallback: use 30 days ago if no data in store at all
  const now = new Date()
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(now.getDate() - 30)
  const fallback = thirtyDaysAgo.toISOString().split('T')[0]
  devConsole('log', '[TransactionsTable DEBUG] firstDay ultimate fallback (30 days ago):', fallback)
  return fallback
})

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
devConsole('log', 'TransactionsTable LIMIT:', LIMIT.value)

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
  // Filter out transactions without transaction_number
  return flattened.filter(
    (transaction) => transaction.transaction_number && transaction.transaction_number.trim() !== '',
  )
})

const totalCredits = computed(() => {
  return flattenedData.value.reduce((sum, t) => sum + (Number(t.amount_credit) || 0), 0)
})

const totalDebits = computed(() => {
  return flattenedData.value.reduce((sum, t) => sum + (Number(t.amount_debit) || 0), 0)
})

const topBudgetCategory = computed(() => {
  const counts: Record<string, number> = {}
  for (const t of flattenedData.value) {
    if (t.budget_category && t.budget_category.trim()) {
      counts[t.budget_category] = (counts[t.budget_category] || 0) + 1
    }
  }
  let top = '--'
  let max = 0
  for (const [cat, count] of Object.entries(counts)) {
    if (count > max) {
      max = count
      top = cat
    }
  }
  return top
})

devConsole('log', 'Flattened Transactions Data:', flattenedData.value)

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
// also watch selectedMemo to refetch when a memo is selected
watch(
  [selectedDay, selectedWeek, selectedMonth, selectedMemo],
  ([newSelectedDay, newSelectedWeek, newSelectedMonth, newSelectedMemo]) => {
    devConsole(
      'log',
      '[TransactionsTable] Watcher fired - selectedDay:',
      newSelectedDay,
      'selectedWeek:',
      newSelectedWeek,
      'selectedMonth:',
      newSelectedMonth,
      'selectedMemo:',
      newSelectedMemo,
    )
    devConsole('log', '[TransactionsTable] Filters changed, resetting page and refetching...')
    store.updateTransactionsCurrentPage(1)
    store.updateTransactionsTableOffset(0)
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

<style scoped>
.bv-transactions {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.bv-summary-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.bv-stat-card {
  --el-card-border-color: var(--bv-border);
  --el-card-bg-color: var(--bv-panel-bg);
  border-radius: var(--bv-radius);
}

.bv-stat-card :deep(.el-statistic__head) {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--bv-sidebar-muted);
}

.bv-stat-card :deep(.el-statistic__content) {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--app-text-color);
}

.bv-section {
  border-radius: var(--bv-radius);
}

.bv-chart-section {
  overflow: hidden;
  border: 1px solid var(--bv-border);
  border-radius: var(--bv-radius);
}

.bv-filters-section {
  padding: 0.25rem 0;
}

.bv-table-section :deep(.el-table) {
  --el-table-border-color: var(--bv-border);
  --el-table-header-bg-color: var(--bv-muted-bg);
  --el-table-row-hover-bg-color: var(--bv-accent);
  border-radius: var(--bv-radius);
  overflow: hidden;
}

.bv-table-section :deep(.el-table th.el-table__cell) {
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--app-text-color);
}

.bv-table-section :deep(.el-table .el-table__row) {
  transition: box-shadow 0.15s ease;
}

.bv-table-section :deep(.el-table .el-table__row:hover) {
  box-shadow: var(--bv-surface-shadow);
}

.bv-link {
  color: var(--bv-primary);
  font-weight: 500;
  text-decoration: none;
}

.bv-link:hover {
  text-decoration: underline;
  text-underline-offset: 2px;
}

.bv-pagination-row {
  display: flex;
  justify-content: center;
  padding: 0.5rem 0;
}

.bv-pagination-row :deep(.el-pagination) {
  --el-pagination-button-bg-color: var(--bv-panel-bg);
  --el-pagination-hover-color: var(--bv-primary);
}

@media (max-width: 768px) {
  .bv-summary-cards {
    grid-template-columns: 1fr;
  }
}
</style>
