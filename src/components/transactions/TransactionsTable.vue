<template>
  <AlertComponent v-if="isError && error" :title="error.name" :message="error.message" type="error"/>
  <MonthSummaryTable v-if="selectedMonth"/>
  <WeekSummaryTable v-if="selectedWeek"/>
  <TransactionsTableSelects/>

  <el-table
      :row-key="getRowKey"
      v-if="data"
      v-loading="isFetching || isLoading || isRefetching"
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
  <el-pagination
      background
      layout="prev, pager, next"
      :total="totalItems"
      :page-count="LIMIT"
      :current-page="currentPage"
      @update:current-page="handleCurrentChange"
      @update:page-size="handleSizeChange"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
  />
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


const store = useTransactionsStore();

const selectedMonth = computed(() => store.getSelectedMonth);
const selectedWeek = computed(() => store.getSelectedWeek);
const selectedMemo = computed(() => store.getSelectedMonth);

const LIMIT = computed(() => store.getTransactionsTableLimit);
const OFFSET = computed(() => store.getTransactionsTableOffset);

const {
  data,
  error,
  isError,
  isLoading,
  isFetching,
  isRefetching,
  refetch
} = useTransactions(LIMIT.value, OFFSET.value);

const totalItems: number | undefined = data?.value?.length

function handleCurrentChange(newPage: number) {
  currentPage.value = newPage;
}

function handleSizeChange(newSize: number) {
  store.updateTransactionsTableLimit(newSize);
  store.updateTransactionsTableOffset(0);
}

const currentPage = computed({
  get: () => Math.floor(store.transactionsTableOffset / store.transactionsTableLimit) + 1,
  set: (val: number) => {
    store.updateTransactionsTableOffset((val - 1) * store.transactionsTableLimit);
  }
});

const paginatedData = computed(() => {
  const start = (currentPage?.value - 1) * store.transactionsTableLimit;
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

function getRowKey(row: Transaction): string {
  return row.transactionNumber;
}

watch(selectedMonth, (newMonth) => {
  if (newMonth) {
    refetch();
  }
});

watch(() => selectedWeek.value, () => {
  refetch();
});

watch(() => selectedMemo.value, () => {
  refetch();
});


onMounted(() => {
  refetch();
});


</script>

<style scoped>
</style>
