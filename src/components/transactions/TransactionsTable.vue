<template>

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
    <el-col :span="4">
      <YearSelect/>
    </el-col>
    <el-col :span="8">
      <MemoSelect/>
    </el-col>
  </el-row>


  <!--  TODO use TableComponent -->
  <el-table
      :row-key="getRowKey"
      v-if="paginatedData"
      v-loading="isFetching || isLoading || isRefetching"
      :data="paginatedData"
      table-layout="auto"
      height="auto"
      size="small"
      border
      stripe
      show-summary
  >
    <el-table-column
        v-for="columnKey in columnKeys"
        :key="columnKey"
        :prop="columnKey"
        :label="columnKey"
    >
      <template v-if="columnKey === 'Transaction Number'" #default="scope">
        <router-link :to="`transactions/${scope.row[columnKey]}`">
          {{ scope.row[columnKey] }}
        </router-link>
      </template>
      <template v-else-if="columnKey === 'Date'" #default="scope">
        <div>
          {{ formatDate(scope.row[columnKey]) }}
        </div>
      </template>
      <template v-else-if="columnKey === 'Memo'" #default="scope">
        <router-link :to="`memos/${encodeURIComponent(scope.row[columnKey])}`">
          {{ scope.row[columnKey] }}
        </router-link>
      </template>
      <template v-else #default="scope">
        {{ scope.row[columnKey] }}
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
      background
      layout="prev, pager, next"
      :total="totalItems"
      :page-size="LIMIT"
      :current-page="currentPage"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
  />
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import type {Transaction} from "@types";
import {formatDate} from "@api/helpers/formatDate";
import WeekSelect from "@components/transactions/WeekSelect.vue";
import MemoSelect from "@components/transactions/MemoSelect.vue";
import MonthSummaryTable from "@components/transactions/MonthSummaryTable.vue";
import MemoSummaryTable from "@components/transactions/MemoSummaryTable.vue";
import WeekSummaryTable from "@components/transactions/WeekSummaryTable.vue";
import YearSelect from "@components/transactions/YearSelect.vue";
import DaySelect from "@components/transactions/DaySelect.vue";
import MonthSelect from "@components/transactions/MonthSelect.vue";
import {useTransactionsStore} from "@stores/transactions";
import useTransactions from "@api/hooks/transactions/useTransactions";

export default defineComponent({
  name: "TransactionsTable",
  components: {
    MonthSelect,
    DaySelect,
    YearSelect,
    WeekSummaryTable,
    MemoSummaryTable,
    MonthSummaryTable,
    MemoSelect,
    WeekSelect
  },
  methods: {formatDate},
  // props: transactionsTableProps,
  setup() {

    const store = useTransactionsStore();

    const LIMIT = computed(() => store.getTransactionsTableLimit);
    const OFFSET = computed(() => store.getTransactionsTableOffset);

    const {
      data,
      error,
      isLoading,
      isFetching,
      isRefetching,
      refetch
    } = useTransactions(LIMIT.value, OFFSET.value);

    const totalItems = data?.value?.length

    function handleCurrentChange(newPage: number) {
      currentPage.value = newPage; // This will automatically update the store's offset
    }

    // Optionally, handle size change if your UI allows changing the number of items per page
    function handleSizeChange(newSize: number) {
      store.updateTransactionsTableLimit(newSize);
      store.updateTransactionsTableOffset(0); // Reset to the beginning or adjust as needed
    }

    const currentPage = computed({
      get: () => Math.floor(store.transactionsTableOffset / store.transactionsTableLimit) + 1,
      set: (val: number) => {
        store.updateTransactionsTableOffset((val - 1) * store.transactionsTableLimit);
      }
    });

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


    function getRowKey(row: Transaction) {
      return row.transactionNumber;
    }

    watch(() => [store.selectedMemo, store.selectedWeek, store.selectedMonth], () => {
      refetch();
    });

    onMounted(() => {
      refetch();
    });

    // TODO move selectedValue Watchers to this component

    return {
      // reactiveTableData,
      columnKeys,
      isFetching,
      isLoading,
      isRefetching,
      paginatedData,
      data,
      error,
      getRowKey,
      selectedWeek: computed(() => store.getSelectedWeek),
      selectedMonth: computed(() => store.getSelectedMonth),
      selectedMemo: computed(() => store.getSelectedMemo),
      totalItems,
      LIMIT,
      currentPage,
      handleCurrentChange,
      handleSizeChange,
    };
  },
});
</script>

<style scoped>
</style>
