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
import {computed, defineComponent, onMounted, watch} from 'vue'
import {useMonths} from "@api/hooks/transactions/useMonths";
import type {MonthYear} from "@types";
import {useTransactionsStore} from "@stores/transactions";
import SelectComponent from "@components/shared/SelectComponent.vue";
import {router} from "@main";

export default defineComponent({
  name: "MonthSelect",
  components: {SelectComponent},
  setup() {

    const store = useTransactionsStore()
    const {data, isFetching, isLoading, isError, error} = useMonths()

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

    watch(
        () => store.getSelectedMonth,
        (newMonth) => {
          if (newMonth) {
            router.push({ name: 'month-summary', params: { month: newMonth } });
          }
        }
    );

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