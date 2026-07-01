<template>
  <div>
    <AlertComponent
      v-if="isError && error"
      :title="error.name"
      :message="error.message"
      type="error"
      data-testid="weekly-amount-debit-total-error"
    />
    <el-statistic
      v-if="data"
      :value="weekTotalAmountDebit"
      title="Weekly Total Amount Debit"
      v-loading="isLoading || isFetching || isRefetching"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElStatistic } from 'element-plus'
import useSumAmountDebitByDate from '@api/hooks/transactions/useSumAmountDebitByDate.ts'
import { useTransactionsStore } from '@stores/transactions.ts'
import AlertComponent from '@components/shared/AlertComponent.vue'

const store = useTransactionsStore()
const selectedWeek = computed(() => store.getSelectedWeek)

const { data, isLoading, isFetching, isRefetching, isError, error } = useSumAmountDebitByDate(
  'week',
  selectedWeek,
)

const weekTotalAmountDebit = computed(() => {
  return data?.value?.[0]?.total_amount_debit ?? 0
})
</script>

<style scoped></style>
