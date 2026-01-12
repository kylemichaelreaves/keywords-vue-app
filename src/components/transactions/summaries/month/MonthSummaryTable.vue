<template>
  <el-card data-testid="month-summary-card">
    <AlertComponent
      v-if="isError && error"
      :title="error.name"
      :message="error?.message"
      type="error"
      data-testid="month-summary-table-error"
    />
    <template #header>
      <MonthSummaryHeader
        :selected-month="selectedMonth"
        :is-last-month="isLastMonth"
        :is-first-month="isFirstMonth"
        :go-to-next-month="goToNextMonth"
        :go-to-previous-month="goToPreviousMonth"
        :reset-selected-month="resetSelectedMonth"
      />
    </template>

    <MemoEditModal ref="memoEditModal" :memo-name="selectedMemoName" />

    <el-row data-testid="month-summary-content-row">
      <el-col :span="12" data-testid="month-summary-table-column">
        <div @contextmenu.prevent>
          <div v-if="isFetching || isLoading || isRefetching">
            <el-skeleton
              v-for="index in 8"
              :key="`skeleton-${index}`"
              animated
              :data-testid="`month-summary-skeleton-${index}`"
              style="margin-bottom: 12px"
            >
              <template #template>
                <div style="display: flex; align-items: center; gap: 16px; padding: 8px 12px">
                  <el-skeleton-item variant="text" style="width: 45%" />
                  <el-skeleton-item variant="text" style="width: 20%" />
                  <el-skeleton-item variant="text" style="width: 30%" />
                </div>
              </template>
            </el-skeleton>
          </div>

          <el-table
            v-else-if="data"
            aria-label="Month Summary Transactions Table"
            :data="data"
            :default-sort="{ prop: 'total_amount_debit', order: 'ascending' }"
            size="small"
            table-layout="fixed"
            show-summary
            sortable
            show-overflow-tooltip
            data-testid="month-summary-transactions-table"
            :data-selected-month="selectedMonth"
            :data-loading="false"
            :data-row-count="data?.length || 0"
            :row-key="(row: MonthSummaryRow) => `${selectedMonth}-${row.memo}`"
            :row-style="getRowStyle"
            @row-contextmenu="openMemoEditModal"
          >
            <el-table-column
              v-for="(column, columnIndex) in columns"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              :data-testid="`column-${column.prop}`"
              sortable
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
                    v-if="column.prop === 'memo_id'"
                    :to="{
                      name: 'memo-summary',
                      params: { memoId: scope.row.memo_id.toString() },
                    }"
                    :data-testid="`memo-link-${scope.row.memo_id}-${selectedMonth}`"
                    :data-memo="scope.row.memo_id"
                    :data-selected-month="selectedMonth"
                  >
                    {{ scope.row.memo_id }}
                  </router-link>
                  <span
                    v-else-if="column.prop === 'memo'"
                    :data-testid="`memo-loading-${scope.row.memo}-${selectedMonth}`"
                  >
                    {{ scope.row.memo }}
                  </span>
                  <div v-else-if="column.prop === 'budget_category'" class="budget-category-cell">
                    <div
                      class="category-color-indicator"
                      :style="{
                        backgroundColor: getBudgetCategoryColor(
                          scope.row.budget_category,
                          scope.row.budget_category_id,
                        ),
                      }"
                    ></div>
                    {{ scope.row[column.prop] }}
                  </div>
                  <span v-else>{{ scope.row[column.prop] }}</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="12" data-testid="budget-category-summaries-column">
        <BudgetCategorySummaries
          v-if="selectedValue"
          :time-frame="timeFrame"
          :date="selectedValue"
          data-testid="budget-category-summaries"
        />
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import {
  ElCard,
  ElCol,
  ElRow,
  ElSkeleton,
  ElSkeletonItem,
  ElTable,
  ElTableColumn,
} from 'element-plus'
import * as d3 from 'd3'
import { useTransactionsStore } from '@stores/transactions.ts'
import useMonthSummary from '@api/hooks/timeUnits/months/useMonthSummary.ts'
import { useBudgetCategorySummary } from '@api/hooks/budgetCategories/useBudgetCategorySummary.ts'
import { useBudgetCategoryColors } from '@composables/useBudgetCategoryColors.ts'
import { type MonthYear, Timeframe } from '@types'
import AlertComponent from '@components/shared/AlertComponent.vue'
import { router } from '@router'
import MonthSummaryHeader from '@components/transactions/summaries/month/MonthSummaryHeader.vue'
import MemoEditModal from '@components/memos/MemoEditModal.vue'
import BudgetCategorySummaries from '@components/transactions/summaries/BudgetCategorySummaries.vue'
import { getTimeframeTypeAndValue } from '@components/transactions/helpers/getTimeframeTypeAndValue.ts'

interface MonthSummaryRow {
  memo: string
  memo_id: number
  total_amount_debit: number
  budget_category: string | null
  budget_category_id?: number
}

const store = useTransactionsStore()
const selectedMonth = computed(() => store.getSelectedMonth)
// Filter out any blank or invalid months from the store
const months = computed(() =>
  store.getMonths.filter(
    (month: MonthYear) => month.month_year != null && month.month_year.trim() !== '',
  ),
)

const memoEditModal = ref<InstanceType<typeof MemoEditModal> | null>(null)
const selectedMemoName = ref<string>('')

// useMonthSummary returns every memo and their total amount debit for the selected month
const { data, isError, refetch, isFetching, isRefetching, isLoading, error } = useMonthSummary()

// Get budget category summary data for color mapping
const { data: budgetCategoryData } = useBudgetCategorySummary(
  computed(() => Timeframe.Month),
  selectedMonth,
)

// Use shared color utility that matches pie chart colors
const { getColorByName, getColorById } = useBudgetCategoryColors(budgetCategoryData)

const { timeFrame, selectedValue } = getTimeframeTypeAndValue()

const columns = [
  { prop: 'memo', label: 'Memo' },
  { prop: 'memo_id', label: 'Memo ID' },
  { prop: 'total_amount_debit', label: 'Total Amount Debit' },
  { prop: 'budget_category_id', label: 'Category ID' },
  { prop: 'budget_category', label: 'Budget Category' },
]

// first, meaning: the most recent month in the database
const isFirstMonth = computed(() => {
  const currentMonths = months.value
  if (!currentMonths.length || !selectedMonth.value) return false
  const firstMonth = currentMonths[0]?.month_year
  return firstMonth === selectedMonth.value
})

// last, meaning: the oldest month
const isLastMonth = computed(() => {
  const currentMonths = months.value
  if (!currentMonths.length || !selectedMonth.value) return false
  const lastMonth = currentMonths.at(-1)?.month_year
  return lastMonth === selectedMonth.value
})

const goToPreviousMonth = () => {
  const currentMonth = selectedMonth.value
  const filteredMonths = months.value

  if (
    currentMonth &&
    filteredMonths.some((month: MonthYear) => month.month_year === currentMonth)
  ) {
    const currentIndex = filteredMonths.findIndex(
      (month: MonthYear) => month.month_year === currentMonth,
    )
    const newIndex = currentIndex + 1

    if (newIndex >= 0 && newIndex < filteredMonths.length) {
      const adjustedMonth = filteredMonths[newIndex]
      if (adjustedMonth) {
        store.setSelectedMonth(adjustedMonth.month_year)
      }
    }
  }
}

const goToNextMonth = () => {
  const currentMonth = selectedMonth.value
  const filteredMonths = months.value

  if (
    currentMonth &&
    filteredMonths.some((month: MonthYear) => month.month_year === currentMonth)
  ) {
    const currentIndex = filteredMonths.findIndex(
      (month: MonthYear) => month.month_year === currentMonth,
    )
    const newIndex = currentIndex - 1

    if (newIndex >= 0 && newIndex < filteredMonths.length) {
      const adjustedMonth = filteredMonths[newIndex]
      if (adjustedMonth) {
        store.setSelectedMonth(adjustedMonth.month_year)
      }
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
  store.setTransactionsTableLimit(100)
})

const openMemoEditModal = (row: MonthSummaryRow) => {
  selectedMemoName.value = row.memo
  memoEditModal.value?.openModal()
}

// Color mapping functions that match the pie chart
const getBudgetCategoryColor = (category?: string | null, categoryId?: number): string => {
  // Prefer using category_id if available (more reliable)
  if (categoryId) {
    return getColorById(categoryId)
  }
  // Fallback to category name
  return getColorByName(category || undefined)
}

// Row styling for the table
const getRowStyle = ({ row }: { row: MonthSummaryRow; rowIndex: number }) => {
  const color = getBudgetCategoryColor(row.budget_category, row.budget_category_id)
  if (!color || color === 'transparent') return {}
  // Use a lighter opacity for better readability
  const lightColor = d3.color(color)?.copy({ opacity: 0.1 })
  return {
    backgroundColor: lightColor?.toString() || 'transparent',
  }
}
</script>

<style scoped>
.budget-category-cell {
  display: flex;
  align-items: center;
  gap: 8px;
}

.category-color-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}
</style>
