<template>
  <SelectComponent
      :selectedValue="selectedYear"
      placeholder="select a year"
      :options="yearOptions"
      :isLoading="isLoading"
      :isFetching="isFetching"
      :isError="isError"
      :error="error"
      :onChange="updateSelectedYear"
      :onClear="clearSelectedYear"
      :disabled="true"
  />

</template>

<script setup lang="ts">
import {computed} from "vue";
import {useYears} from "@api/hooks/transactions/useYears";
import SelectComponent from "@components/shared/SelectComponent.vue";
import {useTransactionsStore} from "@stores/transactions";

const store = useTransactionsStore();
const selectedYear = computed(() => store.getSelectedYear);

const {data, isLoading, isFetching, isError, error } = useYears()

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
  return data.value.map(item => ({
    value: item.year,
    label: item.year
  }));
})


</script>

<style scoped>

</style>