<template>
  <el-card>
    <AlertComponent v-if="isError && error" :title="error.name" :message="error.message" type="error" />
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
      <el-col :span="14">
        <div @contextmenu.prevent>
          <el-table
            v-if='data'
            :data="data"
            table-layout="auto"
            size="large"
            v-loading="isLoadingCondition"
            layout="auto"
            show-summary
            data-testid="week-summary-table"
            @row-contextmenu="openMemoEditModal"
          >
            <el-table-column
              v-for="column in columns"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
            >
              <template v-if="column.prop === 'memo'" v-slot="scope">
                <router-link :to="{ name: 'memo', params: { memoName: scope.row[column.prop] }}">
                  {{ scope.row.memo }}
                </router-link>
              </template>
              <template v-else v-slot="scope">
                {{ scope.row[column.prop] }}
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-col>
      <el-col :span="10">
        <BudgetCategorySummaries
          :data-testid="'budget-category-summaries-for-week'"
          :date="selectedWeek"
          time-frame="week"
        />
      </el-col>
    </el-row>
    <el-row>
      <DaySummariesForSelectedWeekTable />
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import { computed, onUnmounted, ref, watch } from 'vue'
import { ElCard, ElTable, ElTableColumn } from 'element-plus'
import { useTransactionsStore } from '@stores/transactions'
import useWeekSummary from '@api/hooks/transactions/useWeekSummary'
import AlertComponent from '@components/shared/AlertComponent.vue'
import { router } from '@router'
import BudgetCategorySummaries from '@components/transactions/BudgetCategorySummaries.vue'
import DaySummariesForSelectedWeekTable from '@components/transactions/DaySummariesForSelectedWeekTable.vue'
import WeekSummaryHeader from './WeekSummaryHeader.vue'
import MemoEditModal from '@components/transactions/MemoEditModal.vue'

// Define the week summary row structure
interface WeekSummaryRow {
  memo: string
  total_amount_debit: number
  budget_category?: string
}

const store = useTransactionsStore()

const selectedWeek = computed(() => store.getSelectedWeek)

const { data, isError, refetch, isFetching, isLoading, isRefetching, error } = useWeekSummary()

const isLoadingCondition = computed(() => isFetching.value || isLoading.value || isRefetching.value)

const weeks = computed(() => store.getWeeks)

const firstWeek = weeks.value[0].week_year
const lastWeek = weeks.value[weeks.value.length - 1].week_year

const isFirstWeek = computed(() => {
  return firstWeek === selectedWeek.value
})

const isLastWeek = computed(() => {
  return lastWeek === selectedWeek.value
})

const memoEditModal = ref<InstanceType<typeof MemoEditModal> | null>(null)
const selectedMemoName = ref<string>('')

const adjustSelectedWeek = (adjustment: number) => {
  const selectedWeek = store.getSelectedWeek
  const weeks = store.getWeeks

  if (selectedWeek && weeks.some(week => week.week_year === selectedWeek)) {
    const currentIndex = weeks.findIndex(week => week.week_year === selectedWeek)
    const newIndex = currentIndex + adjustment

    if (newIndex >= 0 && newIndex < weeks.length) {
      const adjustedWeek = weeks[newIndex].week_year
      store.setSelectedWeek(adjustedWeek)
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
  { prop: 'memo', label: 'Memo' },
  { prop: 'total_amount_debit', label: 'Weekly Amount Debit' },
  { prop: 'budget_category', label: 'Budget Category' }
]

watch(() => store.selectedWeek, () => {
  refetch()
})

onUnmounted(() => {
  store.setDaysForSelectedWeek([])
})

const openMemoEditModal = (row: WeekSummaryRow) => {
  selectedMemoName.value = row.memo
  memoEditModal.value?.openModal()
}

</script>
