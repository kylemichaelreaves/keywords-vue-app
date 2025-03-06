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
  {prop: 'Transaction Number', label: 'Transaction Number'},
  {prop: 'Date', label: 'Date'},
  {prop: 'Description', label: 'Description'},
  {prop: 'Amount Debit', label: 'Amount Debit'},
  {prop: 'Amount Credit', label: 'Amount Credit'},
  {prop: 'Memo', label: 'Memo'},
  {prop: 'Balance', label: "Balance"},
  {prop: 'Check Number', label: 'Check Number'},
  {prop: 'Fees', label: 'Fees'},
];

const excludedColumns = ['Balance', 'Check Number', 'Fees', 'Memo', 'Amount Credit'];

const filteredColumns = columns.filter(column => !excludedColumns.includes(column.prop));

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