<template>
  <SelectComponent
      :options="dayOptions"
      :selectedValue="selectedDay"
      placeholder="select a day"
      :disabled="true"
      :onChange="updateSelectedDay"
      :loading="isLoading || isFetching"
      loading-text="…loading days…"
  />
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, watch} from 'vue'
import {useDays} from "@api/hooks/transactions/useDays";
import {ElOption, ElSelect} from "element-plus";
import {useTransactionsStore} from "@stores/transactions";
import type {DayYear} from "@types";
import SelectComponent from "@components/shared/SelectComponent.vue";

export default defineComponent({
  name: "DaySelect",
  components: {ElSelect, ElOption, SelectComponent},
  setup() {

    const store = useTransactionsStore()
    // fetch days that will populate the dropdown from the results of this hook
    const {data, isFetching, isLoading, isError, error, refetch} = useDays()
    // make the data usable to the component
    const dayOptions = computed(() => {
      if (!data.value) {
        return []
      }
      return data.value.map((item: DayYear) => ({
        value: item.day,
        label: item.day,
      }));
    });

    const updateSelectedDay = (day: string) => {
      store.setSelectedDay(day)
    }

    onMounted(() => {
      if (data.value) {
        store.setDays(data.value)
      }
    });

    // if there's a selectedMonth, the options should be repopulated with the days of that month
    // if there's a selectedWeek, the options should be repopulated with the days of that week
    watch([() => store.getSelectedMonth, () => store.getSelectedWeek], (newVal, oldVal) => {
      if (newVal) {
        store.setSelectedDay('')
        refetch()
      }
    });

    return {
      data,
      dayOptions,
      isFetching,
      isLoading,
      isError,
      error,
      selectedDay: computed(() => store.getSelectedDay),
      selectedWeek: computed(() => store.getSelectedWeek),
      selectedMonth: computed(() => store.getSelectedMonth),
      updateSelectedDay
    }
  }
})

</script>

<style scoped>
</style>