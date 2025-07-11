<template>
  <div>
    <el-table
        v-if="tableData"
        v-loading="isFetching"
        :data="pagedTableData"
        :default-sort="{prop: 'date', order: 'descending'}"
        :default-filters="store.getFilter"
        :row-key="rowKey"
        table-layout="auto"
        size="small"
        border
        stripe
        show-summary
    >
      <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :sortable="sortableColumns.includes(column.prop)"
      >
        <template v-slot:[`cell-${column.prop}`]="scope">
          <!-- Check if column is in routerLinkColumn prop -->
          <router-link v-if="routerLinkColumn && routerLinkColumn[column.prop]"
                       :to="`${routerLinkColumn[column.prop]}/${encodeURIComponent(scope.row[column.prop])}`">
            {{ scope.row[column.prop] }}
          </router-link>
          <span v-else-if="typeof column.formatter === 'function'">
            {{ column.formatter(scope.row[column.prop]) }}
          </span>
          <span v-else>
            {{ scope.row[column.prop] }}
          </span>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        v-if="shouldShowPagination"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30, 40]"
        :total="tableData?.length"
    />
  </div>
</template>


<script setup lang="ts">
import {ref, computed, watch} from "vue";
import {ElPagination, ElTable, ElTableColumn} from "element-plus";
import {useTransactionsStore} from "@stores/transactions";


const props = defineProps({
  tableData: {
    type: Array as () => Record<string, never>[],
    required: true,
  },
  columns: {
    type: Array as () => Array<{
      prop: string,
      label: string,
      routerLinkBasePath?: string,
      formatter?: (value: string) => string
      pathFunction?: (value: string) => string
    }>,
    required: true,
  },
  sortableColumns: {
    type: Array as () => string[],
    default: () => [],
    required: false,
  },
  isFetching: {
    type: Boolean,
    default: false,
  },
  rowKey: {
    type: String,
    required: false,
  },
  routerLinkColumn: {
    type: Object as () => Record<string, string>,
    required: false,
    default: () => ({}),
  },
  dataTestId: {
    type: String,
    default: '',
    required: false,
  },
})

const store = useTransactionsStore();
const currentPage = ref(1);
const pageSize = ref(100);
// const offset = ref(0);
const tableData = ref(props.tableData);

const pagedTableData = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = currentPage.value * pageSize.value;
  return tableData.value.slice(start, end);
});

const shouldShowPagination = computed(() => {
  return tableData.value.length > pageSize.value;
});

const handleSizeChange = (val: number) => {
  pageSize.value = val;
  currentPage.value = 1;
};


const handleCurrentChange = (val: number) => {
  currentPage.value = val;
};


watch(() => props.tableData, (newData) => {
  tableData.value = newData;
});

</script>

<style scoped>
</style>