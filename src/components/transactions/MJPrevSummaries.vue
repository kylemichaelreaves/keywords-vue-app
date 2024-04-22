<template>
  <LineChart v-if="data && data.length > 0" :summaries="data"/>
  <div v-if="isError">{{ error }}</div>
  <div v-if="isLoading || isFetching || isRefetching">Loading...</div>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, watch} from "vue";
import {useTransactionsStore} from "@stores/transactions";
import {usePrevMJSummaries} from "@api/hooks/transactions/usePrevMJSummaries";
import LineChart from "../charts/LineChart.vue";

export default defineComponent({
  name: 'MJPrevSummaries',
  components: {LineChart},
  setup()
  {

    const store = useTransactionsStore();

    const timeframe = computed(() => {
      if (store.selectedMonth) {
        return 'month';
      } else if (store.selectedWeek) {
        return 'week';
      } else {
        return 'day';
      }
    });

    computed(() => {
      return [
        {prop: 'total_debit', label: 'Total Debit'},
        {prop: `${timeframe.value}_number`, label: `${timeframe.value}`},
        {prop: 'year', label: 'Year'},
      ];
    });

    const {data, isLoading, isFetching, isRefetching, isError, error, refetch} = usePrevMJSummaries();

    onMounted( () => {
      refetch();
    });

    watch(() => store.selectedMonth, () => {
      refetch();
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