<template>
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
  />
  <LineChart
      :data-testid="props.dataTestId"
      v-if="data"
      :summaries="data"
      :loading="isLoading || isFetching"
      :handle-on-click-selection="handleOnDayClicked"
  />
</template>

<script setup lang="ts">
import IntervalForm from "@components/transactions/IntervalForm.vue";
import {computed, ref, watch} from "vue";
import {useDailyTotalAmountDebit} from "@api/hooks/transactions/useDailyTotalAmountDebit";
import AlertComponent from "@components/shared/AlertComponent.vue";
import LineChart from "@components/charts/LineChart.vue";
import {useTransactionsStore} from "@stores/transactions";
import {parseDateMMYYYY} from "@api/helpers/parseDateMMYYYY";
import {parseDateIWIYYY} from "@api/helpers/parseDateIWIYYY";

const props = defineProps({
  dataTestId: {
    type: String,
    default: 'daily-interval-line-chart'
  }
});

const intervalFormDataTestId = computed(() => {
  return props.dataTestId ? `${props.dataTestId}-form` : '';
});

const errorAlertDataTestId = computed(() => {
  return props.dataTestId ? `${props.dataTestId}-error` : '';
});

const store = useTransactionsStore();
const intervalValue = ref("1 months");

const selectedWeek = computed(() => store.selectedWeek);
const selectedMonth = computed(() => store.selectedMonth);
const selectedDay = computed(() => store.selectedDay);

const selectedValue = computed(() => {
  if (selectedWeek.value) {
    return parseDateIWIYYY(selectedWeek.value)?.toISOString().split("T")[0];
  }
  if (selectedMonth.value) {
    return parseDateMMYYYY(selectedMonth.value)?.toISOString().split("T")[0];
  }
  if (selectedDay.value) {
    return selectedDay.value;
  }
  return null;
});

// TODO filter the data based on the selectedWeek, selectedMonth, and selectedDay
// TODO ie, limit the data to the selectedWeek, selectedMonth, or selectedDay

function handleIntervalChange(newInterval: string) {
  intervalValue.value = newInterval;
}

const {data, error, isError, isLoading, isFetching, refetch} = useDailyTotalAmountDebit(intervalValue, selectedValue);

const handleOnDayClicked = (selection: string) => {
  store.setSelectedDay(selection);
}

watch(intervalValue, (newVal) => {
  if (newVal) {
    refetch();
  }
});

watch(selectedDay, (newVal) => {
  if (newVal) {
    refetch();
  }
});

watch(selectedValue, (newVal) => {
  if (newVal) {
    refetch();
  }
});

</script>


<style scoped>
</style>
