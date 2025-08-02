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

    <MemoEditModal ref="memoEditModal" />

    <el-row data-testid="month-summary-content-row">
      <el-col
        :span="12"
        data-testid="month-summary-table-column"
      >
        <div @contextmenu.prevent>
          <el-table
            v-if="data"
            :data="data"
            :default-sort="{prop: 'total_amount_debit', order: 'ascending'}"
            size="small"
            table-layout="fixed"
            v-loading="isFetching || isLoading || isRefetching"
            show-summary
            sortable
            show-overflow-tooltip
            data-testid="month-summary-transactions-table"
            :data-selected-month="selectedMonth"
            :data-loading="isFetching || isLoading || isRefetching"
            :data-row-count="data?.length || 0"
            :row-key="(row: MonthSummaryRow) => `${selectedMonth}-${row.memo}`"
            @row-contextmenu="(row: MonthSummaryRow) => openMemoEditModal(row)"
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
        </div>
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
        />
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { ElCard, ElCol, ElRow, ElTable, ElTableColumn } from 'element-plus'
import { useTransactionsStore } from '@stores/transactions'
import useMonthSummary from '@api/hooks/transactions/useMonthSummary'
import type { MonthYear, Memo } from '@types'
import AlertComponent from '@components/shared/AlertComponent.vue'
import { router } from '@router'
import MonthSummaryHeader from '@components/transactions/MonthSummaryHeader.vue'
import MemoEditModal from '@components/transactions/MemoEditModal.vue'
import BudgetCategorySummaries from '@components/transactions/BudgetCategorySummaries.vue'
import { getTimeframeTypeAndValue } from '@components/transactions/getTimeframeTypeAndValue'
import { fetchMemo } from '@api/transactions/fetchMemo'

// Define the month summary row structure
interface MonthSummaryRow {
  memo: string
  total_amount_debit: number
  budget_category?: string
}

const store = useTransactionsStore()
const selectedMonth = computed(() => store.getSelectedMonth)
const months = computed(() => store.getMonths)

const memoEditModal = ref<InstanceType<typeof MemoEditModal> | null>(null)

// useMonthSummary returns every memo and their total amount debit for the selected month
const { data, isError, refetch, isFetching, isRefetching, isLoading, error } = useMonthSummary()

const { timeFrame, selectedValue } = getTimeframeTypeAndValue()

const columns = [
  { prop: 'memo', label: 'Memo' },
  { prop: 'total_amount_debit', label: 'Total Amount Debit' },
  { prop: 'budget_category', label: 'Budget Category' }
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

const openMemoEditModal = async (row: MonthSummaryRow) => {
  try {
    // Fetch the complete memo data and pass it to the modal
    const memoArray = await fetchMemo(row.memo)

    // Extract the first memo from the array
    const memoToEdit = memoArray[0]

    if (memoToEdit) {
      memoEditModal.value?.openModal(memoToEdit)
    } else {
      console.error('Failed to fetch memo data for:', row.memo)
    }
  } catch (error) {
    console.error('Error fetching memo:', error)
  }
}
</script>