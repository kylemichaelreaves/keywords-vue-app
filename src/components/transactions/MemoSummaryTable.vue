<template>
  <el-card data-testid="memo-summary-card">
    <AlertComponent
      v-if="isError && error"
      :title="error.name"
      :message="error?.message"
      type="error"
      data-testid="memo-summary-table-error"
    />
    <template #header>
      <div class="header-content" v-if="props.memoName" data-testid="memo-summary-header">
        <h2 class="memo-title" data-testid="memo-title">
          {{ props.memoName }}
        </h2>
        <div data-testid="memo-budget-category-container">
          <MemoBudgetCategory
            v-if="props.memoName"
            :key="props.memoName"
            :memoName="props.memoName"
            data-testid="memo-budget-category"
          />
        </div>
      </div>
    </template>

    <el-table
      v-if="data"
      :data="[data]"
      table-layout="auto"
      :loading="isLoadingCondition"
      data-testid="memo-summary-table"
      :row-key="() => 'summary'"
      :cell-style="getCellStyle"
      :row-style="getRowStyle"
    >
      <el-table-column
        v-for="(column, columnIndex) in columns"
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
            :data-row-id="'summary'"
            :data-column="column.prop"
            :data-row-index="scope.$index"
            :data-column-index="columnIndex"
            :data-memo-name="props.memoName"
          >
            <template v-if="column.prop === 'sumAmountDebit'">
              <el-statistic
                :value="scope.row.sum_amount_debit"
                :data-testid="`sum-amount-debit-${props.memoName}`"
                :data-value="scope.row.sum_amount_debit"
              />
            </template>
            <template v-else-if="column.prop === 'transactionsCount'">
              <el-statistic
                :value="scope.row.transactions_count"
                :data-testid="`transactions-count-${props.memoName}`"
                :data-value="scope.row.transactions_count"
              />
            </template>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <MemoTransactionsTable :memoName="props.memoName" data-testid="memo-transactions-table" />
  <BackButton data-testid="memo-summary-back-button" />
</template>

<script setup lang="ts">
import { ElCard, ElStatistic, ElTable, ElTableColumn } from 'element-plus'
import type { Memo, MemoSummary } from '@types'
import useMemoSummary from '@api/hooks/transactions/useMemoSummary'
import { type PropType, reactive, watch } from 'vue'
import MemoTransactionsTable from '@components/transactions/MemoTransactionsTable.vue'
import MemoBudgetCategory from '@components/transactions/MemoBudgetCategory.vue'
import BackButton from '@components/shared/BackButton.vue'
import AlertComponent from '@components/shared/AlertComponent.vue'

interface TableColumn {
  property: string
}


const props = defineProps(
  {
    memoName: {
      type: String as PropType<Memo['name']>,
      required: true
    }
  }
)

const { data, refetch, isFetching, isLoading, isError, error } = useMemoSummary(props.memoName)

const isLoadingCondition = reactive(isLoading || isFetching)

const columns = [
  { prop: 'sumAmountDebit', label: 'Sum Amount Debit' },
  { prop: 'transactionsCount', label: 'Transactions Count' }
]

// Add styling functions for test attributes
const getRowStyle = ({ rowIndex }: { row: MemoSummary, rowIndex: number }) => {
  return {
    '--row-id': 'summary',
    '--row-index': rowIndex,
    '--memo-name': props.memoName
  }
}

const getCellStyle = ({ column, rowIndex, columnIndex }: {
  row: MemoSummary,
  column: TableColumn,
  rowIndex: number,
  columnIndex: number
}) => {
  return {
    '--cell-row-id': 'summary',
    '--cell-column': column.property,
    '--cell-row-index': rowIndex,
    '--cell-column-index': columnIndex,
    '--memo-name': props.memoName
  }
}

watch(() => props.memoName, () => {
  refetch()
})
</script>

<style scoped>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.memo-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>