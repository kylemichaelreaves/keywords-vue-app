<template>
  <AlertComponent v-if="isError && error" :message="error.message" :title="error.name" type="error"/>
  <IntervalForm @update:interval="handleIntervalChange"/>
  <LineChart
      v-if="data"
      :summaries="data"
      :loading="isLoading || isFetching"
      :handle-on-click-selection="handleOnDayClicked"
  />
</template>

<script setup lang="ts">
import IntervalForm from "@components/transactions/IntervalForm.vue";
import {ref, watch} from "vue";
import {useDailyTotalAmountDebit} from "@api/hooks/transactions/useDailyTotalAmountDebit";
import AlertComponent from "@components/shared/AlertComponent.vue";
import LineChart from "@components/charts/LineChart.vue";
import {useTransactionsStore} from "@stores/transactions";

const store = useTransactionsStore();
const intervalForm = ref<string>("3 months");

function handleIntervalChange(newInterval: string) {
  intervalForm.value = newInterval;
}

const {data, error, isError, isLoading, isFetching, refetch} = useDailyTotalAmountDebit(intervalForm);

const handleOnDayClicked = (selection: string) => {
  store.setSelectedDay(selection);
}

watch(intervalForm, (newVal) => {
  if (newVal) {
    refetch();
  }
});

</script>


<style scoped>
</style>
