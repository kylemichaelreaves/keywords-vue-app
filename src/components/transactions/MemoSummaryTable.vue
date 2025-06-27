<template>
  <el-card>
    <div v-if="isError">
      <el-alert type="error" :title="error?.message" />
    </div>
    <template #header>
      <div class="header-content" v-if="props.memoName">
        <h2 class="memo-title">
          {{ props.memoName }}
        </h2>
        <div>
          <MemoBudgetCategory v-if="props.memoName" :key="props.memoName" :memoName="props.memoName" />
        </div>
      </div>
    </template>

    <el-table v-if="data" :data="[data]" table-layout="auto" :loading="isLoadingCondition">
      <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label">
        <template v-slot:default="scope">
          <template v-if="column.prop === 'sumAmountDebit'">
            <el-statistic :value="scope.row.sum_amount_debit" data-testid="sum-amount-debit" />
          </template>
          <template v-else-if="column.prop === 'transactionsCount'">
            <el-statistic :value="scope.row.transactions_count" data-testid="transactions-count" />
          </template>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <MemoTransactionsTable :memoName="props.memoName" />
  <BackButton />
</template>

<script setup lang="ts">
import { ElCard, ElStatistic, ElTable, ElTableColumn } from 'element-plus'
import type { Memo } from '@types'
import useMemoSummary from '@api/hooks/transactions/useMemoSummary'
import { type PropType, watch, reactive } from 'vue'
import MemoTransactionsTable from '@components/transactions/MemoTransactionsTable.vue'
import MemoBudgetCategory from '@components/transactions/MemoBudgetCategory.vue'
import BackButton from '@components/shared/BackButton.vue'

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

