<template>
  <AlertComponent title="error.name" message="error.message" type="error" v-if="isError && error"/>
  <LineChart v-if="data && data.length > 0" :summaries="data"/>
</template>

<script setup lang="ts">
import {onMounted} from "vue";
import {usePrevOFSummaries} from "@api/hooks/transactions/usePrevOFSummaries";
import LineChart from "../charts/LineChart.vue";
import AlertComponent from "@components/shared/AlertComponent.vue";


const {data, isError, error, refetch} = usePrevOFSummaries();

onMounted(() => {
  refetch();
});
</script>

<style scoped>
</style>