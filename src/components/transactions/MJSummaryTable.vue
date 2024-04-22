<template>
  <el-card>
    <template #header>
      <div class="header-container">
        <h3>MJ sum total for: {{ selectedMonth }}</h3>
        <el-statistic
            size="large"
            :value="statisticValue"
            title="Total MJ Amount Debit"
            v-loading="isLoading || isFetching || isRefetching"
        />
      </div>
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
import type {OFSummary} from "@types";

export default defineComponent({
  name: 'MJSummaryTable',
  components: {MJPrevSummaries, ElStatistic, ElRow, ElCol, ElCard},
  setup() {
    const {data, isLoading, isFetching, isError, error, refetch, isRefetching} = useMJAmountDebit();

    const store = useTransactionsStore();

    const dataItems = computed(() => data.value as unknown as OFSummary[])

    const selectedWeek = computed(() => store.getSelectedWeek);
    const selectedMonth = computed(() => store.getSelectedMonth);
    const timeframe = computed(() => store.getTimeframe);


    const statisticValue = computed(() => {
      if (!dataItems.value || !dataItems.value.length) {
        return 0;
      } else {
        return dataItems.value[0].total_debit;
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
    });

    onMounted(() => {
      refetch();
    });


    return {
      data,
      isLoading,
      isFetching,
      isRefetching,
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
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center; /* Optional: Aligns items in the cross-axis (horizontally in this case) */
}
</style>