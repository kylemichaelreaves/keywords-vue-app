<template>
  <AlertComponent v-if="isError && error" :message="error.message" :title="error.name" type="error"/>
  <IntervalForm
      data-testid="interval-form"
      @update:interval-value="handleIntervalChange"
  />
  <LineChart
      data-testid="daily-line-chart"
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

const store = useTransactionsStore();
const intervalValue = ref<string>("1 months");

// TODO get the selectWeek, selectedMonth, and selectedDay from the store
const selectedWeek = computed(() => store.selectedWeek);
const selectedMonth = computed(() => store.selectedMonth);
const selectedDay = computed(() => store.selectedDay);

// TODO filter the data based on the selectedWeek, selectedMonth, and selectedDay
// TODO ie, limit the data to the selectedWeek, selectedMonth, or selectedDay
const filteredData = computed(() => {
  if (data) {
    return data?.value?.filter((item) => {
      if (selectedWeek.value) {
        return String(item.date) === selectedWeek.value;
      }
      if (selectedMonth.value) {
        return String(item.date) === selectedMonth.value;
      }
      if (selectedDay.value) {
        return String(item.date) === selectedDay.value;
      }
      return true;
    });
  }
  return null;
});


function handleIntervalChange(newInterval: string) {
  intervalValue.value = newInterval;
}

const {data, error, isError, isLoading, isFetching, refetch} = useDailyTotalAmountDebit(intervalValue);

const handleOnDayClicked = (selection: string) => {
  store.setSelectedDay(selection);
}

watch(intervalValue, (newVal) => {
  if (newVal) {
    refetch();
  }
});

watch([selectedWeek, selectedMonth, selectedDay], () => {
  refetch();
});

</script>


<style scoped>
</style>
