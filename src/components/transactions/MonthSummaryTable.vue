<template>
  <el-card data-testid="month-summary-card" :data-selected-month="selectedMonth">
    <AlertComponent
      v-if="isError && error"
      :title="error.name"
      :message="error?.message"
      type="error"
      data-testid="month-summary-table-error"
    />
    <template #header>
      <div
        class="card-header"
        data-testid="month-summary-table-header"
        :data-selected-month="selectedMonth"
      >
        <div class="summary-left" data-testid="month-summary-left-section">
          <h2 data-testid="month-summary-title">Month Summary for: {{ selectedMonth }}</h2>
          <MonthlyAmountDebitTotal
            data-testid="monthly-amount-debit-total"
            :data-selected-month="selectedMonth"
          />
        </div>
        <NavigationButtonGroup
          label="Month"
          :is-last="isLastMonth"
          :is-first="isFirstMonth"
          :go-to-next="goToNextMonth"
          :go-to-previous="goToPreviousMonth"
          :reset="resetSelectedMonth"
          data-testid="month-summary-navigation-button-group"
          :data-selected-month="selectedMonth"
          :data-is-first="isFirstMonth"
          :data-is-last="isLastMonth"
        />
      </div>
    </template>
    <el-row data-testid="month-summary-content-row">
      <el-col
        :span="12"
        data-testid="month-summary-table-column"
      >
        <el-table
          v-if="data"
          :data="data"
          :default-sort="{prop: 'total_amount_debit', order: 'ascending'}"
          size="small"
          table-layout="fixed"
          v-loading="isFetching || isLoading || isRefetching"
          show-summary
          sortable
          data-testid="month-summary-transactions-table"
          :data-selected-month="selectedMonth"
          :data-loading="isFetching || isLoading || isRefetching"
          :data-row-count="data?.length || 0"
          :row-key="(row: MonthSummaryRow) => `${selectedMonth}-${row.memo}`"
        >
          <el-table-column
            v-for="(column, columnIndex) in columns"
            :key="column.prop"
            :prop="column.prop"
            :label="column.label"
            :data-testid="`column-${column.prop}`"
          >
            <template #header>
              <span :data-testid="`header-${column.prop}`">{{ column.label }}</span>
            </template>

            <template v-slot:default="scope">
              <div
                :data-testid="`cell-${scope.$index}-${columnIndex}`"
                :data-row-id="`${selectedMonth}-${scope.row.memo}`"
                :data-column="column.prop"
                :data-row-index="scope.$index"
                :data-column-index="columnIndex"
                :data-selected-month="selectedMonth"
                :data-memo="scope.row.memo"
                :data-value="scope.row[column.prop]"
              >
                <router-link
                  v-if="column.prop === 'memo'"
                  :to="{ name: 'memo', params: { memoName: scope.row[column.prop] }}"
                  :data-testid="`memo-link-${scope.row.memo}-${selectedMonth}`"
                  :data-memo="scope.row.memo"
                  :data-selected-month="selectedMonth"
                >
                  {{ scope.row.memo }}
                </router-link>
                <span v-else>{{ scope.row[column.prop] }}</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col
        :span="12"
        data-testid="budget-category-summaries-column"
      >
        <BudgetCategorySummaries
          v-if="selectedValue"
          :time-frame="timeFrame"
          :date="selectedValue"
          data-testid="budget-category-summaries"
          :data-selected-month="selectedMonth"
          :data-time-frame="timeFrame"
          :data-date="selectedValue"
        />
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, watch } from 'vue'
import { ElCard, ElCol, ElRow, ElTable, ElTableColumn } from 'element-plus'
import { useTransactionsStore } from '@stores/transactions'
import useMonthSummary from '@api/hooks/transactions/useMonthSummary'
import type { MonthYear } from '@types'
import AlertComponent from '@components/shared/AlertComponent.vue'
import { router } from '@router'
import MonthlyAmountDebitTotal from '@components/transactions/MonthlyAmountDebitTotal.vue'
import NavigationButtonGroup from '@components/shared/NavigationButtonGroup.vue'
import BudgetCategorySummaries from '@components/transactions/BudgetCategorySummaries.vue'
import { getTimeframeTypeAndValue } from '@components/transactions/getTimeframeTypeAndValue'

// Define the month summary row structure
interface MonthSummaryRow {
  memo: string
  total_amount_debit: number
}

const store = useTransactionsStore()
const selectedMonth = computed(() => store.getSelectedMonth)
const months = computed(() => store.getMonths)

// useMonthSummary returns every memo and their total amount debit for the selected month
const { data, isError, refetch, isFetching, isRefetching, isLoading, error } = useMonthSummary()

const { timeFrame, selectedValue } = getTimeframeTypeAndValue()

const columns = [
  { prop: 'memo', label: 'Memo' },
  { prop: 'total_amount_debit', label: 'Total Amount Debit' }
]

const firstMonth = months.value[0]?.month_year
const lastMonth = months.value[months.value.length - 1]?.month_year

// first, meaning: the most recent month
const isFirstMonth = computed(() => {
  return firstMonth === selectedMonth.value
})

// last, meaning: the oldest month
const isLastMonth = computed(() => {
  return lastMonth === selectedMonth.value
})

const goToPreviousMonth = () => {
  const selectedMonth = store.getSelectedMonth
  const months = store.getMonths

  if (selectedMonth && months.some((month: MonthYear) => month.month_year === selectedMonth)) {
    const currentIndex = months.findIndex((month: MonthYear) => month.month_year === selectedMonth)
    const newIndex = currentIndex + 1

    if (newIndex >= 0 && newIndex < months.length) {
      const adjustedMonth = months[newIndex].month_year
      store.setSelectedMonth(adjustedMonth)
    }
  }
}

const goToNextMonth = () => {
  const selectedMonth = store.getSelectedMonth
  const months = store.getMonths

  if (selectedMonth && months.some((month: MonthYear) => month.month_year === selectedMonth)) {
    const currentIndex = months.findIndex((month: MonthYear) => month.month_year === selectedMonth)
    const newIndex = currentIndex - 1

    if (newIndex >= 0 && newIndex < months.length) {
      const adjustedMonth = months[newIndex].month_year
      store.setSelectedMonth(adjustedMonth)
    }
  }
}

const resetSelectedMonth = () => {
  store.setSelectedMonth('')
  router.push({ name: 'transactions' })
}

watch(selectedMonth, (newMonth) => {
  if (newMonth) {
    refetch()
  }
})

onMounted(() => {
  refetch()
})

onBeforeUnmount(() => {
  //   reset the transactionsPageLimit to the default value
  store.setTransactionsTableLimit(100)
})
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-left {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}
</style>