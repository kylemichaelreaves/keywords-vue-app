<template>
  <div>
    <el-table
        v-if="tableData"
        :loading="isFetching"
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
        <template v-slot:[`cell-${column}`]="scope">
          <slot :name="`cell-${column}`" :row="scope.row">{{ scope.row[column.prop] }}</slot>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="store.getCurrentPage"
        :page-size="store.getPageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30, 40]"
        :total="tableData.length"
    />
  </div>
</template>

<script lang="ts">
import {defineComponent, computed, ref} from "vue";
import {useTransactionsStore} from "@stores/transactions";
import {ElPagination, ElTable, ElTableColumn} from "element-plus";


export default defineComponent({
  name: "TableComponent",
  methods: {computed},
  components: {
    ElTable,
    ElTableColumn,
    ElPagination,
  },
  props: {
    tableData: {
      type: Array as () => string[],
      required: true,
    },
    columns: {
      type: Array as () => {prop: string, label: string}[],
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
    LIMIT: {
      type: Number,
      required: true,
      default: 100,
    },
    OFFSET: {
      type: Number,
      required: true,
      default: 0,
    },
    rowKey: {
      type: String,
      required: false,
    },
    handleSizeChange: {
      type: Function,
      required: false,
    },
    handleCurrentChange: {
      type: Function,
      required: false,
    },
  },
  setup(props) {
    const store = useTransactionsStore();
    const tableData = ref(props.tableData);

    const pagedTableData = computed(() => {
      const start = (store.getCurrentPage - 1) * store.getPageSize;
      const end = store.getCurrentPage * store.getPageSize;
      return tableData.value.slice(start, end);
    });

    const handleSizeChange = (val: number) => {
      store.updatePageSize(val);
      store.updateCurrentPage(1);
    };

    const handleCurrentChange = (val: number) => {
      store.updateCurrentPage(val);
    };

    return {
      store,
      pagedTableData,
      handleSizeChange,
      handleCurrentChange,
    };
  },
});
</script>

<style scoped>
</style>