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

    <el-row>
      <el-col>
        <BudgetCategoriesTreeSelect/>
      </el-col>
    </el-row>


    <el-alert v-if="error" type="error" :title="'Error: ' + error">
      <h2>
        {{ error }}
      </h2>
    </el-alert>
    <br/>

    <el-row style="justify-content: space-evenly">
      <el-col :span="4">
        <DaySelect/>
      </el-col>
      <el-col :span="4">
        <WeekSelect/>
      </el-col>
      <el-col :span="4">
        <MonthSelect/>
      </el-col>
      <el-col :span="8">
        <MemoSelect/>
      </el-col>
      <el-col :span="4">
        <YearSelect/>
      </el-col>
    </el-row>

    <el-row>
      <el-col>
        <TransactionsTable
            class="transactions-table"
            v-if="data"
            :tableData="data"
            :columnKeys="columnKeys"
            :isFetching="isFetching"
            :LIMIT="LIMIT"
            :OFFSET="OFFSET"
            :incrementOffset="incrementOffset"
            :isLoading="isFetching || isLoading"
        />
      </el-col>
    </el-row>
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
import DaySelect from "@components/transactions/DaySelect.vue";
import YearSelect from "@components/transactions/YearSelect.vue";
import BudgetCategoriesTreeSelect from "./transactions/BudgetCategoriesTreeSelect.vue";


export default defineComponent({
  name: "BudgetVisualizer",
  components: {
    BudgetCategoriesTreeSelect,
    YearSelect,
    DaySelect,
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
      data,
      error,
      isLoading,
      isFetching,
      refetch
    } = useTransactions(LIMIT, OFFSET.value);

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

.transactions-table {
  padding-top: 10px;
}
</style>
