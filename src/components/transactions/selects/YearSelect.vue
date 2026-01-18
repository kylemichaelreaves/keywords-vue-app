<template>
  <div>
    <AlertComponent
      :title="error.name"
      :message="error.message"
      type="error"
      v-if="isError && error"
      :data-testid="errorId"
    />
    <SelectComponent
      :data-testid="props.dataTestId"
      :selectedValue="selectedYear"
      placeholder="select a year"
      aria-label="Year selector"
      :options="yearOptions"
      :isLoading="isLoading"
      :isFetching="isFetching"
      :isError="isError"
      :error="error"
      :onChange="updateSelectedYear"
      :onClear="clearSelectedYear"
      :disabled="true"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useYears } from '@api/hooks/timeUnits/years/useYears.ts'
import SelectComponent from '@components/shared/SelectComponent.vue'
import { useTransactionsStore } from '@stores/transactions.ts'
import AlertComponent from '@components/shared/AlertComponent.vue'

const props = defineProps({
  dataTestId: {
    type: String,
    default: 'transactions-table-year-select',
  },
})

const errorId = computed(() => `${props.dataTestId}-error`)

const store = useTransactionsStore()
const selectedYear = computed(() => store.getSelectedYear)

const { data, isLoading, isFetching, isError, error } = useYears()

const updateSelectedYear = (year: string) => {
  store.setSelectedYear(year)
}

const clearSelectedYear = () => {
  store.setSelectedYear('')
}

const yearOptions = computed(() => {
  if (!data.value) {
    return []
  }
  return data.value
    .filter((item) => {
      // Filter out null, undefined, empty string, or whitespace-only values
      return item.year != null && item.year.trim() !== ''
    })
    .map((item) => ({
      value: item.year,
      label: item.year,
    }))
})
</script>

<style scoped></style>
