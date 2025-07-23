<template>
  <AlertComponent v-if="isError && error" :message="error.message" :title="error.name" type="error" />
  <SelectComponent
    :data-testid="props.dataTestId"
    :options="dayOptions"
    :selectedValue="selectedDay"
    placeholder="select a day"
    :onChange="updateSelectedDay"
    :onClear="clearSelectedDay"
    :loading="isLoading || isFetching"
    loading-text="…loading days…"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useDays } from '@api/hooks/transactions/useDays'
import { useTransactionsStore } from '@stores/transactions'
import type { DayYear } from '@types'
import SelectComponent from '@components/shared/SelectComponent.vue'
import AlertComponent from '@components/shared/AlertComponent.vue'
import { router } from '@router'

const props = defineProps({
  dataTestId: {
    type: String,
    default: 'transactions-table-day-select'
  }
})

const store = useTransactionsStore()
const selectedDay = computed(() => store.getSelectedDay)

const { data, isFetching, isLoading, isError, error } = useDays()

const dayOptions = computed(() => {
  if (!data.value) {
    return []
  }
  return data.value.map((item: DayYear) => ({
    value: item.day,
    label: item.day
  }))
})

const updateSelectedDay = (day: string) => {
  store.setSelectedDay(day)
}


const clearSelectedDay = () => {
  store.setSelectedDay('')
  router.push('/budget-visualizer/transactions')
}


</script>

<style scoped>
</style>