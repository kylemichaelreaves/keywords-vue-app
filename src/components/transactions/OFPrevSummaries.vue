<template>
  <AlertComponent title="error.name" message="error.message" type="error" v-if="isError && error"/>
  <LineChart v-if="data && data.length > 0" :summaries="data" :handle-on-click-selection="handleOnMonthClick"/>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {usePrevOFSummaries} from "@api/hooks/transactions/usePrevOFSummaries";
import LineChart from "../charts/LineChart.vue";
import AlertComponent from "@components/shared/AlertComponent.vue";
import {useTransactionsStore} from "@stores/transactions";


const {data, isError, error, refetch} = usePrevOFSummaries();
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