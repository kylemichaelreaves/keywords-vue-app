<template>
  <AlertComponent v-if="error && isError" :title="error.name" :message="error.message" type="error"/>
  <LineChart v-if="data && data.length > 0" :summaries="data"/>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {usePrevMJSummaries} from "@api/hooks/transactions/usePrevMJSummaries";
import LineChart from "../charts/LineChart.vue";
import AlertComponent from "@components/shared/AlertComponent.vue";

const {data, isError, error, refetch} = usePrevMJSummaries();

onMounted(() => {
  refetch();
});
</script>

<style scoped>
</style>