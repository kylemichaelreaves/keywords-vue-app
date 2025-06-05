<template>
  <AlertComponent :title="error.name" :message="error.message" type="error" v-if="isError && error" />
  <SelectComponent
    data-testid="month-select"
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

const store = useTransactionsStore()
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
}

const clearSelectedMonth = () => {
  store.setSelectedMonth('')
}

onBeforeUnmount(() => {
  store.setTransactionsTableLimit(100)
})


</script>

<style scoped>
</style>