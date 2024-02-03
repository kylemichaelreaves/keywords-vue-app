<template>
  <el-card>
    <template #header>
      <el-row style="justify-content: space-around" align="middle">
        <h3>MJ sum total for {{ selectedMonth }}:</h3>
        <el-statistic size="large" :value="statisticValue" title="Total MJ Amount Debit"/>
      </el-row>
    </template>
    <MJPrevSummaries/>
  </el-card>
</template>

<script lang="ts">
import {computed, defineComponent, watch, onMounted} from "vue";
import {ElCard, ElCol, ElRow, ElStatistic} from "element-plus";
import useMJAmountDebit from "@api/hooks/transactions/useMJAmountDebit";
import {useTransactionsStore} from "@stores/transactions";
import MJPrevSummaries from "./MJPrevSummaries.vue";

export default defineComponent({
  name: 'MJSummaryTable',
  components: {MJPrevSummaries, ElStatistic, ElRow, ElCol, ElCard},
  setup() {
    const {data, isLoading, isFetching, isError, error, refetch} = useMJAmountDebit();

    const store = useTransactionsStore();

    const selectedWeek = computed(() => store.getSelectedWeek);
    const selectedMonth = computed(() => store.getSelectedMonth);
    const timeframe = computed(() => store.getTimeframe);

    const statisticValue = computed(() => {
      if (!data.value) {
        return 0;
      } else {
        return data.value[0].total_debit;
      }
    });

    const columns = computed(() => {
      return [
        {prop: 'total_debit', label: 'Total Debit'},
        {prop: `${timeframe.value}_number`, label: `${timeframe.value}`},
        {prop: 'year', label: 'Year'},
      ];
    });

    watch(() => [store.selectedMonth, store.selectedWeek, statisticValue], () => {
      refetch();
      console.log('statisticValue', statisticValue.value);
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
      statisticValue,
      selectedWeek,
      selectedMonth,
      timeframe
    }
  }
})

</script>

<style scoped>

</style>