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
    <el-container>
      <el-aside width="200px">
        <el-menu class="el-menu-vertical-demo" default-active="1">
          <el-menu-item v-for="item in menuItems" :key="item.index" :index="item.index">
            <router-link :to="{name: item.name}">
              <el-icon>
                <component :is="item.icon"/>
              </el-icon>
              <span slot="title">{{ item.title }}</span>
            </router-link>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <el-alert v-if="error" type="error" :title="'Error: ' + error">
          <h2>
            {{ error }}
          </h2>
        </el-alert>
        <br/>
        <!--        <TransactionsTableSummaryTables/>-->
        <!--        <TransactionsTableSelects/>-->

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

        <el-row v-if="showTransactionsTable" style="justify-content: space-evenly">
          <el-col :span="4">
            <DaySelect/>
          </el-col>
          <el-col :span="4">
            <WeekSelect/>
          </el-col>
          <el-col :span="4">
            <MonthSelect/>
          </el-col>
          <el-col :span="4">
            <YearSelect/>
          </el-col>
          <el-col :span="8">
            <MemoSelect/>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <TransactionsTable
                class="transactions-table"
                v-if="showTransactionsTable && paginatedData"
                :tableData="paginatedData"
                :columnKeys="columnKeys"
                :isFetching="isFetching"
                :isLoading="isLoading"
            />
            <!--    TODO fix pagination not loading onMount  -->
            <el-pagination
                v-if="showTransactionsTable"
                background
                layout="prev, pager, next"
                :total="totalItems"
                :page-size="LIMIT"
                :current-page="currentPage"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
            />
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </el-card>
  <VueQueryDevtools/>
  <router-view :key="$route.fullPath"></router-view>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, watch} from "vue";
import useTransactions from "@api/hooks/transactions/useTransactions";
import {Files, Money, OfficeBuilding, TrendCharts} from "@element-plus/icons-vue";
import {useTransactionsStore} from "@stores/transactions";
import {VueQueryDevtools} from '@tanstack/vue-query-devtools'
import BudgetCategoriesTreeSelect from "./transactions/BudgetCategoriesTreeSelect.vue";
import {useRoute, useRouter} from "vue-router";
import TransactionsTable from "./transactions/TransactionsTable.vue";
import TransactionsTableSelects from "@components/transactions/TransactionsTableSelects.vue";
import TransactionsTableSummaryTables from "@components/transactions/TransactionsTableSummaryTables.vue";
import MonthSummaryTable from "@components/transactions/MonthSummaryTable.vue";
import MemoSummaryTable from "@components/transactions/MemoSummaryTable.vue";
import WeekSummaryTable from "@components/transactions/WeekSummaryTable.vue";
import YearSelect from "@components/transactions/YearSelect.vue";
import DaySelect from "@components/transactions/DaySelect.vue";
import MonthSelect from "@components/transactions/MonthSelect.vue";
import WeekSelect from "@components/transactions/WeekSelect.vue";
import MemoSelect from "@components/transactions/MemoSelect.vue";

export default defineComponent({
  name: "BudgetVisualizer",
  components: {
    MemoSelect, WeekSelect, MonthSelect, DaySelect, YearSelect,
    WeekSummaryTable, MemoSummaryTable, MonthSummaryTable,
    TransactionsTableSummaryTables,
    TransactionsTableSelects,
    Money,
    Files,
    OfficeBuilding,
    BudgetCategoriesTreeSelect,
    VueQueryDevtools,
    TrendCharts,
    TransactionsTable,
  },
  setup() {
    const store = useTransactionsStore();

    const route = useRoute(); // Get the current route
    const router = useRouter();

    const LIMIT = computed(() => store.getTransactionsTableLimit);
    const OFFSET = computed(() => store.getTransactionsTableOffset);

    // Reactive references to store state for pagination
    const currentPage = computed({
      get: () => Math.floor(store.transactionsTableOffset / store.transactionsTableLimit) + 1,
      set: (val: number) => {
        store.updateTransactionsTableOffset((val - 1) * store.transactionsTableLimit);
      }
    });

    const menuItems = [
      { index: "1", name: "transactions", icon: "Money", title: "Transactions" },
      { index: "2", name: "memos", icon: "OfficeBuilding", title: "Memos" },
      { index: "3", name: "budget-categories", icon: "Files", title: "Budget Categories" }
    ]


    const {
      data,
      error,
      isLoading,
      isFetching,
      refetch
    } = useTransactions(LIMIT.value, OFFSET.value);

    const totalItems = data?.value?.length

    // Handler for page changes
    function handleCurrentChange(newPage: number) {
      currentPage.value = newPage; // This will automatically update the store's offset
    }

    // Optionally, handle size change if your UI allows changing the number of items per page
    function handleSizeChange(newSize: number) {
      store.updateTransactionsTableLimit(newSize);
      store.updateTransactionsTableOffset(0); // Reset to the beginning or adjust as needed
    }

    const paginatedData = computed(() => {
      const start = (currentPage.value - 1) * store.transactionsTableLimit;
      const end = start + store.transactionsTableLimit;
      return data?.value?.slice(start, end);
    });


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

    const showTransactionsTable = computed(() => route.name === 'transactions');

    watch(() => [store.selectedMemo, store.selectedWeek, store.selectedMonth], () => {
      // update the store's limit when the selected memo, week, or month changes, but not when the value is reset
      // if these values are not null, set the store to 0
      // if (store.selectedMemo || store.selectedWeek || store.selectedMonth) {
      //   store.updateTransactionsTableLimit(0);
      // }

      refetch();
      console.log('totalItems', totalItems)
    });

    onMounted(() => {
      refetch();
    });

    return {
      data,
      error,
      isLoading,
      isFetching,
      selectedWeek: computed(() => store.getSelectedWeek),
      selectedMonth: computed(() => store.getSelectedMonth),
      selectedMemo: computed(() => store.getSelectedMemo),
      LIMIT,
      OFFSET,
      columnKeys,
      handleSizeChange,
      handleCurrentChange,
      currentPage,
      paginatedData,
      totalItems,
      showTransactionsTable,
      menuItems
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
