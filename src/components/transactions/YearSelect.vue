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
  />

</template>

<script lang="ts">
import {computed, type ComputedRef, defineComponent, type Ref} from "vue";
import {useYears} from "@api/hooks/transactions/useYears";
import SelectComponent from "@components/shared/SelectComponent.vue";
import type {Year} from "@types";
import {useTransactionsStore} from "@stores/transactions";

export default defineComponent({
  name: 'YearSelect',
  components: {SelectComponent},
  setup(): {
    data: Ref<Year[]> | Ref<undefined>,
    isLoading: Ref<boolean>,
    isFetching: Ref<boolean>,
    isError: Ref<boolean>,
    error: unknown,
    refetch: () => Promise<unknown>,
    yearOptions: ComputedRef<{ value: string, label: string }[]>,
    selectedYear: ComputedRef<string>,
    updateSelectedYear: (year: string) => void
  } {
    const store = useTransactionsStore();

    const selectedYear = computed(() => store.getSelectedYear);

    const {data, isLoading, isFetching, isError, error, refetch} = useYears()

    const updateSelectedYear = (year: string) => {
      store.setSelectedYear(year)
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

    return {
      data,
      isLoading,
      isFetching,
      isError,
      error,
      refetch,
      yearOptions,
      selectedYear,
      updateSelectedYear
    }
  }
})

</script>

<style scoped>

</style>