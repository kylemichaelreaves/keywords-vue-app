<template>
  <div class="tippy-table-container">
    <div class="tooltip-header">{{ props.month }} - ${{ props.amount }}</div>
    <el-table :data="props.transactions" style="width: 100%" size="small" border>
      <el-table-column prop="date" label="Date" width="100" />
      <el-table-column prop="description" label="Description" min-width="150" />
      <el-table-column
        label="Amount"
        width="100"
        align="right"
        :formatter="(row) => formatAmount(row)"
      />
      <el-table-column prop="budgetCategory" label="Category" width="120" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ElTable, ElTableColumn } from 'element-plus'
import type { Transaction, ToolTipTransactionTableProps } from '@types'

const props = defineProps<ToolTipTransactionTableProps>()

const formatAmount = (row: Partial<Transaction>) => {
  return row.amount_debit
    ? `$${row.amount_debit}`
    : row.amount_credit
      ? `$${row.amount_credit}`
      : '$0.00'
}
</script>

<style scoped>
.tippy-table-container {
  min-width: 400px;
  max-width: 500px;
}

.tooltip-header {
  font-weight: bold;
  margin-bottom: 8px;
  color: #409EFF;
  font-size: 16px;
}
</style>