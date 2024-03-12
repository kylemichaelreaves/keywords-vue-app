<template>
  <el-table
      :row-key="getRowKey"
      v-if="reactiveTableData"
      :loading="isFetching"
      :isFetching="isFetching"
      :data="reactiveTableData"
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
</template>

<script lang="ts">
import {computed, defineComponent, ref} from "vue";
import type {Transaction} from "@types";
import {formatDate} from "@api/helpers/formatDate";

const transactionsTableProps = {
  tableData: {
    type: Array as () => Transaction[],
    required: true,
    default: () => []
  },
  columnKeys: {
    type: Array as () => string[],
    required: false,
    default: () => []
  },
  isFetching: {
    type: Boolean,
    required: false,
    default: false
  },
  isLoading: {
    type: Boolean,
    required: false,
    default: false
  },
  class: {
    type: String,
    required: false,
    default: ''
  }
} as const;

export default defineComponent({
  name: "TransactionsTable",
  methods: {formatDate},
  props: transactionsTableProps,
  setup(props) {

    let {columnKeys, isFetching} = props;

    const reactiveTableData = computed(() => props.tableData);

    function getRowKey(row: Transaction) {
      return row.transactionNumber;
    }

    return {
      reactiveTableData,
      columnKeys,
      isFetching,
      getRowKey
    };
  },
});
</script>

<style scoped>
</style>
