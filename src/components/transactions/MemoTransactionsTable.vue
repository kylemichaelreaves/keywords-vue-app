<template>
  <AlertComponent
    v-if="isError && error"
    :title="error.name"
    :message="error?.message || 'An error occurred while fetching memo transactions.'"
    type="error"
    data-testid="memo-summary-transactions-error"
  />
  <el-table
    v-loading="isLoadingCondition"
    v-if="data"
    :data="data"
    :data-testid="props.dataTestId"
    row-key="transaction_number"
  >
    <el-table-column
      v-for="(column, columnIndex) in filteredColumns"
      :key="column.prop"
      :prop="column.prop"
      :label="column.label"
      :data-testid="`column-${column.prop}`"
    >
      <template #header>
        <span :data-testid="`header-${column.prop}`">{{ column.label }}</span>
      </template>

      <template v-slot:default="scope">
        <div
          :data-testid="`cell-${scope.$index}-${columnIndex}`"
          :data-row-id="scope.row.transaction_number"
          :data-column="column.prop"
          :data-row-index="scope.$index"
          :data-column-index="columnIndex"
          :data-memo-name="props.memoName"
          :data-transaction-number="scope.row.transaction_number"
        >
          <span>{{ scope.row[column.prop] }}</span>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import useMemoTransactions from '@api/hooks/transactions/useMemoTransactions'
import { type PropType, reactive } from 'vue'
import type { Memo } from '@types'
import { ElTableColumn } from 'element-plus'
import AlertComponent from '@components/shared/AlertComponent.vue'

const props = defineProps({
  memoName: {
    type: String as PropType<Memo['name']>,
    required: true
  },
  dataTestId: {
    type: String,
    default: 'memo-transactions-table'
  }
})
const columns = [
  { prop: 'transaction_number', label: 'Transaction Number' },
  { prop: 'date', label: 'Date' },
  { prop: 'description', label: 'Description' },
  { prop: 'amount_debit', label: 'Amount Debit' },
  { prop: 'amount_credit', label: 'Amount Credit' },
  { prop: 'memo', label: 'Memo' },
  { prop: 'balance', label: 'Balance' },
  { prop: 'check_number', label: 'Check Number' },
  { prop: 'fees', label: 'Fees' }
]

const excludedColumns = ['balance', 'check_number', 'fees', 'memo', 'amount_credit']

const filteredColumns = columns.filter(column => !excludedColumns.includes(column.prop))

const { data, error, isError, isFetching, isLoading } = useMemoTransactions(props.memoName)

const isLoadingCondition = reactive(
  isLoading || isFetching
)

</script>

