<template>
  <AlertComponent
    :title="error.name"
    :message="error.message"
    type="error" v-if="isError && error"
    :data-testid="errorId"
  />
  <SelectComponent
    :data-testid="props.dataTestId"
    :options="monthOptions"
    :selectedValue="store.selectedMonth"
    placeholder="select a month"
    :disabled="isLoading || isFetching"
    :onChange="updateSelectedMonth"
    :on-clear="clearSelectedMonth"
  />
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount } from 'vue'
import { useMonths } from '@api/hooks/transactions/useMonths'
import type { MonthYear } from '@types'
import { useTransactionsStore } from '@stores/transactions'
import SelectComponent from '@components/shared/SelectComponent.vue'
import AlertComponent from '@components/shared/AlertComponent.vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  dataTestId: {
    type: String,
    default: 'transactions-table-month-select'
  }
})

const errorId = computed(() => `${props.dataTestId}-error`)

const store = useTransactionsStore()

const router = useRouter()

const { data, isFetching, isLoading, isError, error } = useMonths()

const monthOptions = computed(() => {
  if (!data.value) {
    return []
  }
  return data.value.map((item: MonthYear) => ({
    value: item.month_year,
    label: item.month_year
  }))
})

const updateSelectedMonth = (month: string) => {
  // set the limit to 0, to return all of the months data
  store.setTransactionsTableLimit(200)
  store.setSelectedMonth(month)
  router.push(`/budget-visualizer/transactions/months/${month}/summary`)
}

const clearSelectedMonth = () => {
  store.setSelectedMonth('')
  router.push('/budget-visualizer/transactions')
}

onBeforeUnmount(() => {
  store.setTransactionsTableLimit(100)
})


</script>

<style scoped>
</style>