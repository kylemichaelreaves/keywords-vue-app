<template>
  <el-card>
    <template #header>
    <el-row style="justify-content: space-around" align="middle">
      <h3>MJ sum total for {{ timeframe }} {{ selectedMonth }}:</h3>
      <el-statistic v-if="data" size="large" :value="data[0].total_debit" :key="data" data-testid="mj-amount-debit"/>
    </el-row>
    </template>
      <MJPrevSummaries/>
  </el-card>
</template>

<script lang="ts">
import {computed, defineComponent, watch, onMounted} from "vue";
import {ElCard, ElCol, ElRow, ElStatistic} from "element-plus";
import useMJAmountDebit from "../../api/hooks/transactions/useMJAmountDebit";
import {useTransactionsStore} from "../../stores/transactionsStore";
import MJPrevSummaries from "./MJPrevSummaries.vue";

export default defineComponent({
  name: 'MJSummaryTable',
  components: {MJPrevSummaries, ElStatistic, ElRow, ElCol, ElCard},
  setup() {
    const {data, isLoading, isFetching, isError, error, refetch} = useMJAmountDebit();

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