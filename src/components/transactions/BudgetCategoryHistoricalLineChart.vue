<template>
  <AlertComponent v-if="error && isError" :title="error.name" :message="error.message" type="error" />
  <LineChart
    v-loading="isLoadingCondition"
    v-if="data && data.length > 0"
    :summaries="data"
    :handle-on-click-selection="handleOnTimeframeClick"
  />
</template>

<script setup lang="ts">
import { useHistoricalSummaryForBudgetCategory } from '@api/hooks/transactions/useHistoricalSummaryForBudgetCategory.ts'
import { getTimeframeTypeAndValue } from '@components/transactions/getTimeframeTypeAndValue.ts'
import AlertComponent from '@components/shared/AlertComponent.vue'
import LineChart from '@components/charts/LineChart.vue'
import { getIsoWeekNumber } from '@api/helpers/getIsoWeekNumber.ts'
import { useTransactionsStore } from '@stores/transactions.ts'
import { computed } from 'vue'

const props = defineProps({
  budgetCategoryName: {
    type: String,
    required: true
  }
})




const store = useTransactionsStore()

const isLoadingCondition = computed(() => {
  return isLoading.value || isFetching.value || isRefetching.value
})

const { timeFrame, selectedValue } = getTimeframeTypeAndValue()

const handleOnTimeframeClick = (dateString: string) => {
  const clickedDate = new Date(dateString)

  // Check your data type to determine how to format the selection
  const hasWeekData = data.value?.some(item => 'week_number' in item)
  const hasMonthData = data.value?.some(item => 'month_number' in item && !('day_number' in item))

  if (hasWeekData) {
    // Convert to week format
    const year = clickedDate.getFullYear()
    const weekNumber = getIsoWeekNumber(clickedDate)
    const weekSelection = `${weekNumber.toString().padStart(2, '0')}-${year}`
    store.setSelectedWeek(weekSelection)
  } else if (hasMonthData) {
    // Convert to month format
    const year = clickedDate.getFullYear()
    const month = (clickedDate.getMonth() + 1).toString().padStart(2, '0')
    const monthSelection = `${month}-${year}`
    store.setSelectedMonth(monthSelection)
  } else {
    // Daily data - convert to month for now
    const year = clickedDate.getFullYear()
    const month = (clickedDate.getMonth() + 1).toString().padStart(2, '0')
    store.setSelectedMonth(`${month}-${year}`)
  }
}


const {
  data,
  isLoading,
  isFetching,
  isRefetching,
  isError,
  error
} = useHistoricalSummaryForBudgetCategory(
  props.budgetCategoryName,
  timeFrame,
  selectedValue?.value ? selectedValue.value : '',
  true
)


</script>


<style scoped>
</style>