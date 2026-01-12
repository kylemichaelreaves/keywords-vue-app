<template>
  <div :data-testid="props.dataTestId" v-if="shouldShowChart">
    <AlertComponent
      v-if="isError && error"
      :message="error.message"
      :title="error.name"
      type="error"
      :data-testid="errorAlertDataTestId"
    />
    <IntervalForm
      :data-testid="intervalFormDataTestId"
      @update:interval-value="handleIntervalChange"
      v-model:interval-value="intervalValue"
    />
    <div v-if="isLoading || isFetching" style="padding: 20px; text-align: center">
      <span>Loading chart data...</span>
    </div>
    <LineChart
      v-if="data"
      :summaries="data"
      :loading="false"
      :handle-on-click-selection="handleOnDayClicked"
      :data-testid="`${props.dataTestId}-line-chart`"
    />
  </div>
</template>

<script setup lang="ts">
import IntervalForm from '@components/transactions/charts/DailyIntervalLineChart/IntervalForm.vue'
import { computed, ref } from 'vue'
import { useDailyTotalAmountDebit } from '@api/hooks/timeUnits/days/useDailyTotalAmountDebit.ts'
import AlertComponent from '@components/shared/AlertComponent.vue'
import LineChart from '@components/charts/LineChart.vue'
import { useTransactionsStore } from '@stores/transactions.ts'
import { parseDateMMYYYY } from '@api/helpers/parseDateMMYYYY.ts'
import { parseDateIWIYYY } from '@api/helpers/parseDateIWIYYY.ts'
import { DateTime } from 'luxon'

const props = defineProps({
  dataTestId: {
    type: String,
    default: 'daily-interval-line-chart',
  },
  firstDay: {
    type: String,
    default: '',
  },
})

const intervalFormDataTestId = computed(() => {
  return props.dataTestId ? `${props.dataTestId}-form` : ''
})

const errorAlertDataTestId = computed(() => {
  return props.dataTestId ? `${props.dataTestId}-error` : ''
})

const store = useTransactionsStore()

const intervalValue = ref('1 month')

const selectedWeek = computed(() => store.selectedWeek)
const selectedMonth = computed(() => store.selectedMonth)
const selectedDay = computed(() => store.selectedDay)

/**
 * CRITICAL FIX: selectedValue computed property
 *
 * This computed property MUST always return a valid date string to ensure:
 * 1. The useDailyTotalAmountDebit hook's enabled condition passes
 * 2. API requests for daily intervals data are made
 * 3. The chart loads properly in both development and test environments
 *
 * DO NOT change this logic without updating test mocks accordingly.
 */
const selectedValue = computed((): string | null => {
  if (selectedWeek.value) {
    return parseDateIWIYYY(selectedWeek.value)?.toISOString().split('T')[0] ?? null
  }
  if (selectedMonth.value) {
    return parseDateMMYYYY(selectedMonth.value)?.toISOString().split('T')[0] ?? null
  }
  if (selectedDay.value) {
    return selectedDay.value
  }
  // CRITICAL FIX: Ensure we always have a valid date to enable the API call
  // Use firstDay prop or fall back to last day of previous month
  // This prevents the API hook from being disabled due to empty/null startDate
  if (props.firstDay) {
    return props.firstDay
  }
  // Fall back to last day of previous month (which is what the date will always be when there are days)
  // Using Luxon for cleaner date manipulation
  const lastDayOfPreviousMonth = DateTime.now().minus({ months: 1 }).endOf('month')
  return lastDayOfPreviousMonth.toISODate()
})

function handleIntervalChange(newInterval: string) {
  intervalValue.value = newInterval
}

const { data, error, isError, isLoading, isFetching } = useDailyTotalAmountDebit(
  intervalValue,
  selectedValue,
)

const handleOnDayClicked = (selection: string) => {
  store.setSelectedDay(selection)
}

/**
 * CRITICAL: shouldShowChart visibility logic
 *
 * This controls when the chart is visible to users:
 * - Show chart when in aggregate view (no specific selections)
 * - Hide chart when user has drilled down to specific time periods
 *
 * This logic is tested in Playwright tests and should not be modified
 * without updating corresponding test expectations.
 */
const shouldShowChart = computed(() => {
  // Hide chart if any specific time period is selected
  if (selectedDay.value && selectedDay.value !== '') {
    return false
  }
  if (selectedWeek.value && selectedWeek.value !== '') {
    return false
  }
  if (selectedMonth.value && selectedMonth.value !== '') {
    return false
  }

  // Show chart when no specific selection is made (aggregate view)
  return true
})
</script>
