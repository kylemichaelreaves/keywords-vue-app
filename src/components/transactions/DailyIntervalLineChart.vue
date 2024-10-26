<template>
  <AlertComponent v-if="isError && error" :message="error.message" :title="error.name" type="error"/>
  <IntervalForm @update:interval="handleIntervalChange" />
  <LineChart :summaries="data" :loading="isLoading || isFetching" />
</template>

<script setup lang="ts">
import IntervalForm from "@components/transactions/IntervalForm.vue";
import {ref, watch} from "vue";
import {useDailyTotalAmountDebit} from "@api/hooks/transactions/useDailyTotalAmountDebit";
import AlertComponent from "@components/shared/AlertComponent.vue";
import LineChart from "@components/charts/LineChart.vue";

const intervalForm = ref<string>("3 months");

function handleIntervalChange(newInterval: string) {
  intervalForm.value = newInterval;
}

const {data, error, isError, isLoading, isFetching, refetch} = useDailyTotalAmountDebit(intervalForm);

watch(intervalForm, (newVal) => {
  if (newVal) {
    refetch();
  }
});

</script>


<style scoped>

</style>
