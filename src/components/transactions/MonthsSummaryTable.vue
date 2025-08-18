<template>
  <div>
    <AlertComponent v-if="isError && error" :message="error.message" type="error" :title="error.name" />
    <h4>Months Summary Table</h4>
    <el-text size="large">A summary table of all the months I have in my database</el-text>
    <!--  TODO use TableComponent -->
    <el-table
      v-if="data && data.length > 0"
      :data="data"
      v-loading="isFetching || isLoading || isRefetching"
      :row-key="selectedMonth"
      border
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
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElTable, ElTableColumn } from 'element-plus'
import useSummaries from '@api/hooks/transactions/useSummaries'
import { useTransactionsStore } from '@stores/transactions'
import type { Summaries } from '@types'
import AlertComponent from '@components/shared/AlertComponent.vue'


const store = useTransactionsStore()
const selectedMonth = computed(() => store.getSelectedMonth)

const { data, isError, isFetching, isRefetching, isLoading, error } = useSummaries()

const tableRowClassName = ({ row }: { row: Summaries }) => {
  let className = ''
  const isHighlighted = row.period === selectedMonth.value

  if (isHighlighted) {
    className = 'highlight-row'
  }

  if (row.amount_difference < 0) {
    className += ' negative-amount'
  } else if (row.amount_difference > 0) {
    className += ' positive-amount'
  }

  return className
}

const columns = [
  { prop: 'period', label: 'Period' },
  { prop: 'total_debit', label: 'Total Debit' },
  { prop: 'total_credit', label: 'Total Credit' },
  { prop: 'amount_difference', label: 'Amount Difference' }
]


</script>

<style>

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