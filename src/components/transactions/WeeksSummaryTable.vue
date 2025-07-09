<template>
  <el-card>
    <AlertComponent
      v-if="isError && error"
      :title="error.name"
      :message="error?.message"
      type="error"
      data-testid="error-alert"
    />
    <el-table
      v-if="data && data.length > 0"
      v-loading="isFetching || isLoading || isRefetching"
      :data="data"
      :row-key="data[0].period"
      stripe
      border
      style="width: 100%">
      <el-table-column
        v-for="column in columns"
        :key="column.prop"
        :prop="column.prop"
        :label="column.label"
      />
    </el-table>
  </el-card>

</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { ElCard, ElTable, ElTableColumn } from 'element-plus'
import useSummaries from '@api/hooks/transactions/useSummaries'
import { useTransactionsStore } from '@stores/transactions'
import AlertComponent from '@components/shared/AlertComponent.vue'


const store = useTransactionsStore()

const { data, isError, refetch, isFetching, isLoading, isRefetching, error } = useSummaries()

const columns = [
  { prop: 'period', label: 'Period' },
  { prop: 'totalDebit', label: 'Total Amount Debit' },
  { prop: 'totalCredit', label: 'Total Amount Credit' },
  { prop: 'amountDifference', label: 'Amount Difference' }
]

onMounted(() => {
  refetch()
  if (data.value) {
    store.setWeeksSummaries(data.value)
  }
})

</script>

<style scoped>
</style>