<template>
  <el-card>
    <AlertComponent
      v-if="isError && error"
      :title="error.name"
      :message="error.message"
      type="error"
    />
    <template #header>
      <WeekSummaryHeader
        :selected-week="selectedWeek"
        :is-first-week="isFirstWeek"
        :is-last-week="isLastWeek"
        :go-to-next-week="goToNextWeek"
        :go-to-previous-week="goToPreviousWeek"
        :reset-selected-week="resetSelectedWeek"
      />
    </template>

    <MemoEditModal ref="memoEditModal" :memo-name="selectedMemoName" />

    <el-row :gutter="5">
      <el-col :span="10">
        <div @contextmenu.prevent>
          <TableSkeleton
            v-if="isLoadingCondition"
            :columns="columns"
            :rows="5"
            data-testid="week-summary-table-skeleton"
          />
          <el-table
            v-else-if="data"
            :data="data"
            table-layout="auto"
            size="default"
            layout="auto"
            show-summary
            data-testid="week-summary-table"
            @row-contextmenu="openMemoEditModal"
            :row-style="getRowStyle"
          >
            <el-table-column
              v-for="column in columns"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
              :sortable="column.sortable"
            >
              <template v-if="column.prop === 'memo_id'" v-slot="scope">
                <router-link
                  :to="{
                    name: 'memo-summary',
                    params: { memoId: scope.row.memo_id.toString() },
                  }"
                >
                  {{ scope.row.memo }}
                </router-link>
              </template>
              <template v-else-if="column.prop === 'budget_category'" v-slot="scope">
                <div class="budget-category-cell">
                  <div
                    class="category-color-indicator"
                    :style="{
                      backgroundColor: getBudgetCategoryColor(
                        scope.row.budget_category,
                        scope.row.category_id,
                      ),
                    }"
                  ></div>
                  {{ scope.row[column.prop] }}
                </div>
              </template>
              <template v-else v-slot="scope">
                {{ scope.row[column.prop] }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="14">
        <BudgetCategorySummaries
          :data-testid="'budget-category-summaries-for-week'"
          :date="selectedWeek"
          :time-frame="Timeframe.Week"
        />
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { ElCard, ElTable, ElTableColumn } from 'element-plus'
import * as d3 from 'd3'
import { useTransactionsStore } from '@stores/transactions.ts'
import useWeekSummary from '@api/hooks/timeUnits/weeks/useWeekSummary.ts'
import { useBudgetCategorySummary } from '@api/hooks/budgetCategories/useBudgetCategorySummary.ts'
import { useBudgetCategoryColors } from '@composables/useBudgetCategoryColors.ts'
import AlertComponent from '@components/shared/AlertComponent.vue'
import { router } from '@router'
import BudgetCategorySummaries from '@components/transactions/BudgetCategorySummaries.vue'
import WeekSummaryHeader from './WeekSummaryHeader.vue'
import MemoEditModal from '@components/memos/MemoEditModal.vue'
import TableSkeleton from '@components/shared/TableSkeleton.vue'
import { Timeframe } from '@types'

// Define the week summary row structure
interface WeekSummaryRow {
  memo: string
  total_amount_debit: number
  budget_category?: string
  category_id?: number
}

const store = useTransactionsStore()

const selectedWeek = computed(() => store.getSelectedWeek)

const { data, isError, refetch, isFetching, isLoading, isRefetching, error } = useWeekSummary()

// Get budget category summary data for color mapping
const { data: budgetCategoryData } = useBudgetCategorySummary(
  computed(() => Timeframe.Week),
  selectedWeek,
)

// Use shared color utility that matches pie chart colors
const { getColorByName, getColorById } = useBudgetCategoryColors(budgetCategoryData)

const isLoadingCondition = computed(() => isFetching.value || isLoading.value || isRefetching.value)

const weeks = computed(() => store.getWeeks)

// first, meaning: the most recent week
const isFirstWeek = computed(() => {
  const currentWeeks = weeks.value
  if (!currentWeeks.length || !selectedWeek.value) return false
  const firstWeek = currentWeeks[0]?.week_year
  return firstWeek === selectedWeek.value
})

// last, meaning: the oldest week
const isLastWeek = computed(() => {
  const currentWeeks = weeks.value
  if (!currentWeeks.length || !selectedWeek.value) return false
  const lastWeek = currentWeeks.at(-1)?.week_year
  return lastWeek === selectedWeek.value
})

const memoEditModal = ref<InstanceType<typeof MemoEditModal> | null>(null)
const selectedMemoName = ref<string>('')

const adjustSelectedWeek = (adjustment: number) => {
  const selectedWeek = store.getSelectedWeek
  const weeks = store.getWeeks

  if (selectedWeek && weeks.some((week) => week.week_year === selectedWeek)) {
    const currentIndex = weeks.findIndex((week) => week.week_year === selectedWeek)
    const newIndex = currentIndex + adjustment

    if (newIndex >= 0 && newIndex < weeks.length) {
      const weekAtIndex = weeks[newIndex]
      if (weekAtIndex) {
        const adjustedWeek = weekAtIndex.week_year
        store.setSelectedWeek(adjustedWeek)
      }
    }
  }
}

const goToPreviousWeek = () => {
  adjustSelectedWeek(1)
}

const goToNextWeek = () => {
  adjustSelectedWeek(-1)
}

const resetSelectedWeek = () => {
  store.setSelectedWeek('')
  router.push({ name: 'transactions' })
}

const columns = [
  { prop: 'memo', label: 'Memo', sortable: true },
  { prop: 'total_amount_debit', label: 'Weekly Amount Debit', sortable: true },
  { prop: 'budget_category', label: 'Budget Category', sortable: true },
]

watch(
  () => store.selectedWeek,
  () => {
    refetch()
  },
)

const openMemoEditModal = (row: WeekSummaryRow) => {
  selectedMemoName.value = row.memo
  memoEditModal.value?.openModal()
}

// Now we can use category_id directly for color mapping, just like the pie chart
const getBudgetCategoryColor = (category?: string, categoryId?: number): string => {
  // Prefer using category_id if available (more reliable)
  if (categoryId) {
    return getColorById(categoryId)
  }
  // Fallback to category name
  return getColorByName(category)
}

// Row styling for the table
const getRowStyle = ({ row }: { row: WeekSummaryRow; rowIndex: number }) => {
  const color = getBudgetCategoryColor(row.budget_category, row.category_id)
  if (!color || color === 'transparent') return {}
  // Use a lighter opacity for better readability
  const lightColor = d3.color(color)?.copy({ opacity: 0.1 })
  return {
    backgroundColor: lightColor?.toString() || 'transparent',
  }
}

onUnmounted(() => {
  store.setDaysForSelectedWeek([])
})
</script>

<style scoped>
.budget-category-cell {
  display: flex;
  align-items: center;
}

.category-color-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
}
</style>
