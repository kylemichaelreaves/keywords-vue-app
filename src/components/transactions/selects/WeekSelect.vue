<template>
  <div :data-testid="props.dataTestId">
    <AlertComponent
      :title="error.name"
      :message="error.message"
      type="error"
      v-if="isError && error"
    />
    <SelectComponent
      :options="weekOptions"
      :selectedValue="selectedWeek"
      placeholder="select a week"
      aria-label="Week selector"
      :onChange="updateSelectedWeek"
      :onClear="clearSelectedYear"
      :disabled="isLoading || isFetching"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useWeeks } from '@api/hooks/timeUnits/weeks/useWeeks.ts'
import { useTransactionsStore } from '@stores/transactions.ts'
import SelectComponent from '@components/shared/SelectComponent.vue'
import AlertComponent from '@components/shared/AlertComponent.vue'
import { router } from '@router'

const props = defineProps({
  dataTestId: {
    type: String,
    default: 'transactions-table-week-select',
  },
})

const store = useTransactionsStore()

const selectedWeek = computed(() => store.getSelectedWeek)

const { data, isLoading, isFetching, isError, error } = useWeeks()

const weekOptions = computed(() => {
  if (!data.value) {
    return []
  }
  return data.value
    .filter((item) => {
      // Filter out null, undefined, empty string, or whitespace-only values
      return item.week_year != null && item.week_year.trim() !== ''
    })
    .map((item) => ({
      value: item.week_year,
      label: item.week_year,
    }))
})

const updateSelectedWeek = (week: string) => {
  store.setSelectedWeek(week)
  router.push(`/budget-visualizer/transactions/weeks/${week}/summary`)
}

const clearSelectedYear = () => {
  store.setSelectedWeek('')
  router.push('/budget-visualizer/transactions')
}
</script>
