<template>
  <AlertComponent v-if="error && isError" :title="error.name" :message="error.message" type="error"/>
  <LineChart v-if="data && data.length > 0" :summaries="data" :handle-on-click-selection="handleOnMonthClick"/>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {usePrevMJSummaries} from "@api/hooks/transactions/usePrevMJSummaries";
import LineChart from "../charts/LineChart.vue";
import AlertComponent from "@components/shared/AlertComponent.vue";
import {useTransactionsStore} from "@stores/transactions";

const {data, isError, error, refetch} = usePrevMJSummaries();

const store = useTransactionsStore();

const handleOnMonthClick = (selection: string) => {
  store.setSelectedMonth(selection);
}

onMounted(() => {
  refetch();
});
</script>

<style scoped>
</style>