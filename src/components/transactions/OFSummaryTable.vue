<template>
  <el-card>
    <template #header>
      <el-row align="middle" style="justify-content: space-around">
        <!--      TODO don't hardcode selectedMonth, but whatever the selectedPeriod? is -->
        <h3>OF sum total for {{ selectedMonth }}:</h3>
        <el-statistic size="large" :value="statisticValue" title="Total OF Amount Debit"/>
      </el-row>
    </template>
    <div v-if="isError">{{ error }}</div>
    <div v-if="isLoading || isFetching">Loading...</div>
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

    watch(() => [store.selectedMonth, store.selectedWeek], () => {
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
      statisticValue,
      timeframe
    }
  }
})

</script>

<style scoped>
</style>