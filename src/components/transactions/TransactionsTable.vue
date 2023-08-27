<template>
  <el-table
      :row-key="row => row['Transaction Number']"
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
        <router-link :to="`budget-visualizer/transactions/${scope.row[columnKey]}`">
          {{ scope.row[columnKey] }}
        </router-link>
      </template>
      <template v-else-if="columnKey === 'Date'" #default="scope">
        <div>
          {{ formatDate(scope.row[columnKey]) }}
        </div>
      </template>
      <template v-else-if="columnKey === 'Memo'" #default="scope">
        <router-link :to="`budget-visualizer/memos/${encodeURIComponent(scope.row[columnKey])}`">
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
import {computed, defineComponent} from "vue";
import type {Transaction} from "@types";
import formatDate from "@api/helpers/formatDate";

const transactionsTableProps = {
  tableData: {
    type: Array as () => Transaction[],
    required: true,
    default: () => []
  },
  LIMIT: {
    type: Number,
    required: true,
    default: 100
  },
  OFFSET: {
    type: Number,
    required: true,
    default: 0
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
  }
} as const;

export default defineComponent({
  methods: {formatDate},
  props: transactionsTableProps,
  setup(props) {

    const {LIMIT, OFFSET, columnKeys, isFetching} = props;

    const reactiveTableData = computed(() => props.tableData);

    return {
      reactiveTableData,
      LIMIT,
      OFFSET,
      columnKeys,
      isFetching
    };
  },
});
</script>

<style scoped>
</style>
