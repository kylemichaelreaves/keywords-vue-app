<template>
  <SelectComponent
      :options="monthOptions"
      :selectedValue="store.selectedMonth"
      placeholder="select a month"
      :disabled="!!selectedWeek"
      :onChange="updateSelectedMonth"
  />
</template>

<script lang="ts">
import {computed, defineComponent, onMounted} from 'vue'
import {useMonths} from "@api/hooks/transactions/useMonths";
import type {MonthYear} from "@types";
import {useTransactionsStore} from "@stores/transactions";
import SelectComponent from "@components/shared/SelectComponent.vue";

export default defineComponent({
  name: "MonthSelect",
  components: {SelectComponent},
  setup() {

    const store = useTransactionsStore()
    // fetch months that will populate the dropdown from the result of this hook
    const {data, isFetching, isLoading, isError, error} = useMonths()
    // make the data usable to the component
    const monthOptions = computed(() => {
      if (!data.value) {
        return []
      }
      return data.value.map((item: MonthYear) => ({
        value: item.month_year,
        label: item.month_year,
      }));
    });

    const updateSelectedMonth = (month: string) => {
      store.setSelectedMonth(month)
    }

    onMounted(() => {
      if (data.value) {
        store.setMonths(data.value)
      }
    });

    return {
      data,
      monthOptions,
      isFetching,
      isLoading,
      isError,
      error,
      selectedMonth: computed(() => store.getSelectedMonth),
      selectedWeek: computed(() => store.getSelectedWeek),
      updateSelectedMonth,
      store
    }
  }
})
</script>

<style scoped>
</style>