<template>
  <LineChart v-if="data && data.length > 0" :summaries="data"/>
  <div v-if="isError">{{ error }}</div>
  <div v-if="isLoading || isFetching || isRefetching">Loading...</div>
</template>

<script lang="ts">
import {defineComponent, onMounted, watch} from "vue";
import {useTransactionsStore} from "@stores/transactions";
import {usePrevOFSummaries} from "@api/hooks/transactions/usePrevOFSummaries";
import LineChart from "../charts/LineChart.vue";

export default defineComponent({
  name: 'OFPrevSummaries',
  components: {LineChart},
  setup() {

    const store = useTransactionsStore();

    const {data, isLoading, isFetching, isError, error, refetch, isRefetching} = usePrevOFSummaries();

    onMounted(() => {
      refetch();
      if (data.value) {
        store.setOFSummaries(data.value)
      }
    });

    watch(() => store.selectedMonth, () => {
      refetch();
      if (data.value) {
        store.setOFSummaries(data.value)
      }
    });

    watch(() => store.selectedWeek, () => {
      refetch();
    });


    return {
      data,
      isLoading,
      isFetching,
      isRefetching,
      isError,
      error,
    }
  }
})

</script>

<style scoped>

</style>