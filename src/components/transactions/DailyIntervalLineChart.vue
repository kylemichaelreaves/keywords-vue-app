<template>
  <div>
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
    <LineChart
      :data-testid="props.dataTestId"
      v-if="data"
      :summaries="data"
      :loading="isLoading || isFetching"
      :handle-on-click-selection="handleOnDayClicked"
    />
  </div>
</template>

<script setup lang="ts">
import IntervalForm from '@components/transactions/IntervalForm.vue'
import { computed, ref } from 'vue'
import { useDailyTotalAmountDebit } from '@api/hooks/transactions/useDailyTotalAmountDebit'
import AlertComponent from '@components/shared/AlertComponent.vue'
import LineChart from '@components/charts/LineChart.vue'
import { useTransactionsStore } from '@stores/transactions'
import { parseDateMMYYYY } from '@api/helpers/parseDateMMYYYY'
import { parseDateIWIYYY } from '@api/helpers/parseDateIWIYYY'

const props = defineProps({
  dataTestId: {
    type: String,
    default: 'daily-interval-line-chart'
  },
  firstDay: {
    type: String,
    default: ''
  }
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
  return props.firstDay ?? null
})

function handleIntervalChange(newInterval: string) {
  intervalValue.value = newInterval
}


const { data, error, isError, isLoading, isFetching } = useDailyTotalAmountDebit(
  intervalValue,
  selectedValue
)

const handleOnDayClicked = (selection: string) => {
  store.setSelectedDay(selection)
}

</script>

<style scoped>
</style>