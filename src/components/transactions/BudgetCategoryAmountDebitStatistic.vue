<template>
  <div>
    <AlertComponent title="error.name" message="error.message" type="error" v-if="isError && error" />
    <StatisticComponent
      v-if="totalAmountDebit"
      :value="totalAmountDebit"
      :title="props.budgetCategoryName"
      v-loading="isLoading || isFetching || isRefetching"
      :precision="2"
      :data-test-id="props.dataTestId"
    />
  </div>
</template>

<script setup lang="ts">
import { useBudgetCategoryAmountDebit } from '@api/hooks/transactions/useBudgetCategoryAmountDebit.ts'
import { getTimeframeTypeAndValue } from '@components/transactions/getTimeframeTypeAndValue.ts'
import AlertComponent from '@components/shared/AlertComponent.vue'
import StatisticComponent from '@components/shared/StatisticComponent.vue'
import { computed } from 'vue'

const props = defineProps({
  budgetCategoryName: {
    type: String,
    required: true
  },
  dataTestId: {
    type: String,
    default: 'budget-category-amount-debit-statistic'
  }
})

const { timeFrame, selectedValue } = getTimeframeTypeAndValue()


const { data, isLoading, isFetching, isRefetching, refetch, isError, error } = useBudgetCategoryAmountDebit(
  props.budgetCategoryName,
  timeFrame,
  selectedValue?.value ? selectedValue.value : '',
  true
)

// Make totalAmountDebit reactive using computed
const totalAmountDebit = computed(() => {
  // Handle different possible response structures
  if (!data.value) return null
  // If data.value is an array (like from your logs), take the first item
  if (Array.isArray(data.value) && data.value.length > 0) {
    const result = data.value[0]
    return result.total_amount_debit || result.total_debit || 0
  }
  // If data.value is an object
  if (typeof data.value === 'object') {
    return data.value.total_amount_debit ?? 0
  }
  return 0
})

</script>