<template>
  <el-card>
    <template #header>
    <el-row align="middle" style="justify-content: space-around">
      <h3>OF sum total for {{ timeframe }} {{ selectedMonth }}:</h3>
      <el-statistic v-if="data" size="large" :value="data[0].total_debit" :key="data"/>
    </el-row>
    </template>
      <OFPrevSummaries/>
  </el-card>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, watch} from "vue";
import useOFAmountDebit from "@api/hooks/transactions/useOFAmountDebit";
import {ElCard, ElStatistic, ElTable, ElTableColumn} from "element-plus";
import {useTransactionsStore} from "@stores/transactions";
import OFPrevSummaries from "./OFPrevSummaries.vue";

export default defineComponent({
  name: 'OFSummaryTable',
  components: {OFPrevSummaries, ElTable, ElTableColumn, ElCard, ElStatistic},
  setup() {

    const {data, isLoading, isFetching, isError, error, refetch} = useOFAmountDebit();

    const store = useTransactionsStore();

    const selectedWeek = computed(() => store.getSelectedWeek);
    const selectedMonth = computed(() => store.getSelectedMonth);

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

    watch(() => store.selectedMonth, () => {
      refetch();
    });

    watch(() => store.selectedWeek, () => {
      refetch();
    });

    onMounted(() => {
      refetch();
    });


    return {
      data,
      isLoading,
      isFetching,
      isError,
      error,
      columns,
      selectedWeek,
      selectedMonth,
      timeframe
    }
  }
})

</script>

<style scoped>

</style>