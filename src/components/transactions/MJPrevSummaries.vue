<template>
  <LineChart v-if="data && data.length > 0" :summaries="data"/>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, watch} from "vue";
import {useTransactionsStore} from "../../stores/transactionsStore";
import {usePrevMJSummaries} from "../../api/hooks/transactions/usePrevMJSummaries";
import LineChart from "../charts/LineChart.vue";

export default defineComponent({
  name: 'MJPrevSummaries',
  components: {LineChart},
  setup() {

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

    const columns = computed(() => {
      return [
        {prop: 'total_debit', label: 'Total Debit'},
        {prop: `${timeframe.value}_number`, label: `${timeframe.value}`},
        {prop: 'year', label: 'Year'},
      ];
    });

    const {data, isLoading, isFetching, isError, error, refetch} = usePrevMJSummaries();

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
      isError,
      error,
    }
  }
})

</script>


<style scoped>

</style>