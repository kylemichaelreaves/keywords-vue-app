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
        :current-page="currentPage"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[10, 20, 30, 40]"
        :total="tableData.length"
    />
  </div>
</template>


<script lang="ts">
import {defineComponent, ref, computed} from "vue";
import {ElPagination, ElTable, ElTableColumn} from "element-plus";
import {useTransactionsStore} from "@stores/transactions";

export default defineComponent({
  name: "TableComponent",
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
      type: Array as () => { prop: string, label: string }[],
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
    const currentPage = ref(1);
    const pageSize = ref(props.LIMIT);
    const tableData = ref(props.tableData);

    const pagedTableData = computed(() => {
      const start = (currentPage.value - 1) * pageSize.value;
      const end = currentPage.value * pageSize.value;
      return tableData.value.slice(start, end);
    });

    const handleSizeChange = (val: number) => {
      pageSize.value = val;
      currentPage.value = 1;
    };

    const handleCurrentChange = (val: number) => {
      currentPage.value = val;
    };

    return {
      pagedTableData,
      handleSizeChange,
      handleCurrentChange,
      currentPage,
      pageSize,
      store,
    };
  },
});
</script>

<style scoped>
</style>