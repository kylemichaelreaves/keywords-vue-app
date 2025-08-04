<template>
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
    data-test-id="monthly-amount-debit-total-statistic"
  />
</template>

<script setup lang="ts">
import { computed, watch } from 'vue'
import { ElStatistic } from 'element-plus'
import useSumAmountDebitByDate from '@api/hooks/transactions/useSumAmountDebitByDate'
import { useTransactionsStore } from '@stores/transactions'
import AlertComponent from '@components/shared/AlertComponent.vue'


const store = useTransactionsStore()
const selectedMonth = computed(() => store.getSelectedMonth)


const {
  data,
  isLoading,
  isFetching,
  isRefetching,
  isError,
  error,
  refetch
} = useSumAmountDebitByDate('month', selectedMonth.value)

const dataItems = computed(() => data.value)

const statisticValue = computed(() => {
  if (!dataItems.value) {
    return 0
  } else {
    return dataItems.value[0].total_amount_debit
  }
})


watch(() => selectedMonth, (newValue) => {
  if (newValue) {
    refetch()
  }
}, { immediate: true })


</script>
