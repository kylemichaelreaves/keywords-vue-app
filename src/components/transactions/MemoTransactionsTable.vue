<template>
  <div v-if="isError">
    <el-alert type="error" :title="error"/>
  </div>
  <el-table v-if="data" :data="data" :loading="isLoadingCondition" size="large">
    <el-table-column v-for="column in filteredColumns" :key="column.prop" :prop="column.prop" :label="column.label">
      <template v-slot:default="scope">
        <span>{{ scope.row[column.prop] }}</span>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import type {Memo} from "@types";
import useMemoTransactions from "@api/hooks/transactions/useMemoTransactions";
import {type PropType, reactive} from "vue";
import {ElTableColumn} from "element-plus";

const props = defineProps({
  memoName: {
    type: String as PropType<Memo['name']>,
    required: true,
  },
});

const columns = [
  {prop: 'transaction_number', label: 'Transaction Number'},
  {prop: 'date', label: 'Date'},
  {prop: 'description', label: 'Description'},
  {prop: 'amount_debit', label: 'Amount Debit'},
  {prop: 'amount_credit', label: 'Amount Credit'},
  {prop: 'memo', label: 'Memo'},
  {prop: 'balance', label: "Balance"},
  {prop: 'check_number', label: 'Check Number'},
  {prop: 'fees', label: 'Fees'},
];

const excludedColumns = ['balance', 'check_number', 'fees', 'memo', 'amount_credit'];

const filteredColumns = columns.filter(column => !excludedColumns.includes(column.prop));

// TODO we should just be able to use useTransactions here and pass in the memo
const {data, error, isError, isFetching, isLoading} = useMemoTransactions(props.memoName);

const isLoadingCondition = reactive(
  isLoading || isFetching
);

// watch(() => props.memoName, () => {
//   refetch();
// });

</script>

<style scoped>
</style>