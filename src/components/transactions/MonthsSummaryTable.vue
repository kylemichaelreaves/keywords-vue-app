<template>
  <!--  TODO paginate this table, use the TableComponent -->
  <h4>Months Summary Table</h4>
  <div v-if="selectedMonth">
    <el-table
        v-if="data && data.length > 0"
        :data="data"
        :key="selectedMonth"
        border
        style="width: 100%"
        table-layout="auto"
        size="small"
        :row-class-name="tableRowClassName"
        show-summary
    >
      <el-table-column
          v-for="column in columns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
      />
    </el-table>
  </div>
  <div v-else>
    <p>Please select a month to display the data.</p>
  </div>

</template>

<script lang="ts">
import {defineComponent, computed, type Ref, type ComputedRef, onMounted} from 'vue'
import {ElCard, ElTable, ElTableColumn} from "element-plus";
import useSummaries from "@api/hooks/transactions/useSummaries";
import {useTransactionsStore} from "@stores/transactions";
import type {Summaries} from "@types";


export default defineComponent({
  name: "MonthsSummaryTable",
  components: {
    ElCard,
    ElTable,
    ElTableColumn
  },
  setup(): {
    data: Summaries[] | undefined,
    isError: Ref<boolean>,
    refetch: () => void,
    isFetching: Ref<boolean>,
    isLoading: Ref<boolean>,
    error: unknown,
    columns: { prop: string; label: string }[],
    tableRowClassName: (params: { row: Summaries }) => string,
    selectedMonth: ComputedRef<string>
  } {
    const store = useTransactionsStore()
    const selectedMonth = computed(() => store.getSelectedMonth)

    const {data: dataRef, isError, refetch, isFetching, isLoading, error} = useSummaries()
    const data = dataRef.value

    const tableRowClassName = ({row}: { row: Summaries }) => {
      let className = '';
      const isHighlighted = row.period === selectedMonth.value

      if (isHighlighted) {
        className = 'highlight-row';
      }

      if (row.amount_difference < 0) {
        className += ' negative-amount';
      } else if (row.amount_difference > 0) {
        className += ' positive-amount';
      }

      return className;
    }

    onMounted(() => {
      refetch()
    });

    const columns = [
      {prop: 'period', label: 'Period'},
      {prop: 'total_debit', label: 'Total Debit'},
      {prop: 'total_credit', label: 'Total Credit'},
      {prop: 'amount_difference', label: 'Amount Difference'},
    ];

    return {
      data, isError, refetch, isFetching, isLoading, error, columns, tableRowClassName, selectedMonth
    }
  }
})
</script>

<style>
.card-header {
  display: flex;
  justify-content: space-between;
  padding: 0 10px;
}

.highlight-row {
  background-color: #86f0ff !important; /* Change this color to your liking */
  border: 5px solid red !important;
}

.positive-amount {
  background-color: lightgreen !important;
}

.negative-amount {
  background-color: #ffcccc !important;
}

</style>