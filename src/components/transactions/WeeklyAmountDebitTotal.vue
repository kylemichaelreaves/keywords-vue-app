<template>
  <AlertComponent
    v-if="isError && error"
    :title="error.name"
    :message="error.message"
    type="error"
    data-testid="weekly-amount-debit-total-error"
  />
  <el-statistic
    v-if="data"
    :value="data.total_amount_debit"
    title="Weekly Total Amount Debit"
    v-loading="isLoading || isFetching || isRefetching"
  />
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { ElStatistic } from 'element-plus'
import useSumAmountDebitByDate from '@api/hooks/transactions/useSumAmountDebitByDate'
import { useTransactionsStore } from '@stores/transactions'
import AlertComponent from '@components/shared/AlertComponent.vue'


const store = useTransactionsStore()

const {
  data,
  isLoading,
  isFetching,
  isRefetching,
  isError,
  error,
  refetch
} = useSumAmountDebitByDate('week', store.selectedWeek)

watch(() => store.selectedWeek, (newValue) => {
  if (newValue) {
    refetch()
  }
}, { immediate: true })


</script>

<style scoped>
</style>