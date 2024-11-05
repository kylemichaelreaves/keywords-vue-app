<template>
  <DailyIntervalLineChart />
  <AlertComponent v-if="isError && error" :title="error.name" :message="error.message" type="error"/>
  <MonthSummaryTable v-if="selectedMonth"/>
  <WeekSummaryTable v-if="selectedWeek"/>
  <TransactionsTableSelects/>

  <el-table
      data-testid="transactions-table"
      :row-key="getRowKey"
      v-if="flattenedData"
      v-loading="isFetching || isLoading || isRefetching || isFetchingNextPage || isFetchingPreviousPage"
      :data="paginatedData"
      table-layout="auto"
      height="auto"
      size="small"
      border
      stripe
      show-summary
  >
    <el-table-column v-for="columnKey in columnKeys" :key="columnKey" :prop="columnKey" :label="columnKey">
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
        <router-link :to="`memos/${scope.row[columnKey]}`">
          {{ scope.row[columnKey] }}
        </router-link>
      </template>
      <template v-else #default="scope">
        {{ scope.row[columnKey] }}
      </template>
    </el-table-column>
  </el-table>
  <TransactionTablePagination v-if="!isPaginationDisabled"/>
</template>

<script setup lang="ts">
import {computed, onMounted, watch} from "vue";
import type {Transaction} from "@types";
import {formatDate} from "@api/helpers/formatDate";
import MonthSummaryTable from "@components/transactions/MonthSummaryTable.vue";
import WeekSummaryTable from "@components/transactions/WeekSummaryTable.vue";
import {useTransactionsStore} from "@stores/transactions";
import useTransactions from "@api/hooks/transactions/useTransactions";
import TransactionsTableSelects from "@components/transactions/TransactionsTableSelects.vue";
import AlertComponent from "@components/shared/AlertComponent.vue";
import DailyIntervalLineChart from "@components/transactions/DailyIntervalLineChart.vue";
import TransactionTablePagination from "@components/transactions/TransactionsTablePagination.vue";
import {getDateTypeAndValue} from "@components/transactions/getDateTypeAndValue";

const store = useTransactionsStore();

const selectedMonth = computed(() => store.getSelectedMonth);
const selectedWeek = computed(() => store.getSelectedWeek);
const selectedDay = computed(() => store.getSelectedDay);

const dateTypeAndValue = computed(() => getDateTypeAndValue());
const selectedValue = computed(() => dateTypeAndValue.value.selectedValue);

// disable the pagination if day, week, or month is selected
const isPaginationDisabled = computed(() => selectedDay.value || selectedWeek.value || selectedMonth.value);

const LIMIT = computed(() => store.getTransactionsTableLimit);

const {
  data,
  error,
  isError,
  isLoading,
  isFetching,
  isFetchingNextPage,
  isFetchingPreviousPage,
  isRefetching,
  refetch,
  fetchNextPage,
  hasNextPage
} = useTransactions();

const flattenedData = computed(() => {
  return data?.value?.pages.flat() || [];
});

const currentPage = computed({
  get: () => Math.floor(store.transactionsTableOffset / store.transactionsTableLimit) + 1,
  set: (val: number) => {
    store.updateTransactionsTableOffset((val - 1) * store.transactionsTableLimit);
  }
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * LIMIT.value;
  const end = start + LIMIT.value;
  return flattenedData.value.slice(start, end);
});

const loadMorePagesIfNeeded = async () => {
  const requiredDataCount = currentPage.value * LIMIT.value;
  while (flattenedData.value.length < requiredDataCount && hasNextPage.value) {
    await fetchNextPage();
  }
};

watch(currentPage, () => {
  loadMorePagesIfNeeded();
});

// this block allows the DailyIntervalLineChart to set the selectedDay and trigger a refetch
watch(
    [selectedValue],
    () => {
      store.clearTransactionsByOffset();
      refetch();
    },
    {immediate: true}
);


// Define table columns
let columnKeys = [
  'Transaction Number',
  'Date',
  'Description',
  'Memo',
  'Amount Debit',
  'Amount Credit',
  'Balance'
];

function getRowKey(row: Transaction): string {
  return row.transactionNumber;
}

onMounted(() => {
  refetch();
});

</script>

<style scoped>
</style>