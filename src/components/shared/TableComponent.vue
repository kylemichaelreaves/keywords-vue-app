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
          <slot :name="`cell-${column}`" :row="scope.row">{{ scope.row[column.prop] }}</slot>
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


<script lang="ts">
import {defineComponent, ref, computed, watch} from "vue";
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
      // TODO determine the type of tableData
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
    rowKey: {
      type: String,
      required: false,
    }
  },
  setup(props) {
    const store = useTransactionsStore();
    const currentPage = ref(1);
    const pageSize = ref(100);
    const offset = ref(0);
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


    return {
      pagedTableData,
      handleSizeChange,
      handleCurrentChange,
      currentPage,
      pageSize,
      store,
      offset,
      shouldShowPagination,
    };
  },
});
</script>

<style scoped>
</style>