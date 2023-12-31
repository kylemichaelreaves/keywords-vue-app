<template>
  <el-card class="dark">
    <template #header>
      <h2>
        <el-icon style="vertical-align: middle">
          <TrendCharts/>
        </el-icon>
        Budget Visualizer
      </h2>
    </template>

    <el-row style="justify-content: space-between">
      <!--      TODO add DaySummaryTable component-->
      <Suspense>
        <MemoSummaryTable v-if="selectedMemo"/>
      </Suspense>
      <Suspense>
        <MonthSummaryTable v-if="selectedMonth"/>
      </Suspense>
      <Suspense>
        <WeekSummaryTable v-if="selectedWeek"/>
      </Suspense>
    </el-row>

    <el-alert v-if="error" type="error" :title="'Error: ' + error">
      <h2>
        {{ error }}
      </h2>
    </el-alert>
    <br/>

    <el-row style="justify-content: space-between">
      <el-col :span="20">
        <WeekSelect/>
        <MonthSelect/>
        <MemoSelect/>
      </el-col>
    </el-row>

    <TransactionsTable
        v-if="data"
        :tableData="data"
        :columnKeys="columnKeys"
        :isFetching="isFetching"
        :LIMIT="LIMIT"
        :OFFSET="OFFSET"
        :incrementOffset="incrementOffset"
        :loading="isFetching || isLoading"
    />
  </el-card>
  <VueQueryDevtools/>
  <router-view :key="$route.fullPath"></router-view>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import TransactionsTable from "./transactions/TransactionsTable.vue";
import useTransactions from "@api/hooks/transactions/useTransactions";
import MonthSelect from "./transactions/MonthSelect.vue";
import MemoSelect from "./transactions/MemoSelect.vue";
import {TrendCharts} from "@element-plus/icons-vue";
import {useTransactionsStore} from "@stores/transactions";
import MemoSummaryTable from "./transactions/MemoSummaryTable.vue";
import WeekSelect from "./transactions/WeekSelect.vue";
import WeekSummaryTable from "./transactions/WeekSummaryTable.vue";
import MonthSummaryTable from "./transactions/MonthSummaryTable.vue";
import {VueQueryDevtools} from '@tanstack/vue-query-devtools'

export default defineComponent({
  name: "BudgetVisualizer",
  components: {
    VueQueryDevtools,
    MemoSummaryTable,
    MonthSummaryTable,
    WeekSummaryTable,
    TrendCharts,
    MemoSelect,
    MonthSelect,
    WeekSelect,
    TransactionsTable,
  },
  setup() {
    const store = useTransactionsStore();
    const LIMIT = 100;
    const OFFSET = ref(0);
    const {
      data: dataRef,
      error,
      isLoading,
      isFetching,
      refetch
    } = useTransactions(LIMIT, OFFSET.value);

    const data = dataRef.value

    function incrementOffset() {
      OFFSET.value += LIMIT;
      refetch();
    }

    let columnKeys = [
      'Transaction Number',
      'Date',
      'Description',
      'Memo',
      'Amount Debit',
      'Amount Credit',
      'Balance',
      'Check Number',
      'Fees'
    ];

    columnKeys = columnKeys.filter(key => key !== 'Check Number' && key !== 'Fees');

    watch(() => [store.selectedMemo, store.selectedWeek, store.selectedMonth], () => {
      refetch();
    });

    onMounted(() => {
      refetch();
    });

    return {
      data,
      error,
      incrementOffset,
      isLoading,
      isFetching,
      selectedWeek: computed(() => store.getSelectedWeek),
      selectedMonth: computed(() => store.getSelectedMonth),
      selectedMemo: computed(() => store.getSelectedMemo),
      LIMIT,
      OFFSET,
      columnKeys,
    };
  },
});
</script>

<style scoped>



.dark {
  background-color: #383838;
  color: #ecf0f1;
}
</style>
