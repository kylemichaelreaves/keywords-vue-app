<template>
  <div>
    <AlertComponent
      v-if="isError && error"
      :title="error.name"
      :message="error?.message"
      type="error"
      data-test-id="monthly-amount-debit-total-error"
    />
    <el-statistic
      v-if="data"
      :value="statisticValue"
      title="Monthly Total Amount Debit"
      v-loading="isLoading || isFetching || isRefetching"
      :precision="2"
      data-testid="monthly-amount-debit-total-statistic"
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
const selectedMonth = computed(() => store.getSelectedMonth)

const { data, isLoading, isFetching, isRefetching, isError, error } = useSumAmountDebitByDate(
  'month',
  selectedMonth,
)

const statisticValue = computed(() => data.value?.[0]?.total_amount_debit ?? 0)
</script>
