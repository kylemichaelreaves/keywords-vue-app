<template>
  <el-select
      :model-value="selectedDay"
      placeholder="select a day"
      @change:selectedDay="updateSelectedDay"
      :disabled="isFetching || isLoading || isError"
      clearable
      filterable
  >
    <el-option
        v-for="item in dayOptions"
        :key="item.value"
        :label="item.label"
        :value="item.value"
    />
  </el-select>

</template>

<script lang="ts">
import {computed, defineComponent, onMounted} from 'vue'
import {useDays} from "@api/hooks/transactions/useDays";
import {ElOption, ElSelect} from "element-plus";
import {useTransactionsStore} from "@stores/transactions";
import type {DayYear} from "@types";

export default defineComponent({
  name: "DaySelect",
  components: {ElSelect, ElOption},
  setup() {

    const store = useTransactionsStore()
    // fetch days that will populate the dropdown from the results of this hook
    const {data, isFetching, isLoading, isError, error} = useDays()
    // make the data usable to the component
    const dayOptions = computed(() => {
      if (!data.value) {
        return []
      }
      return data.value.map((item: DayYear) => ({
        value: item.day_year,
        label: item.day_year,
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

    return {
      data,
      dayOptions,
      isFetching,
      isLoading,
      isError,
      error,
      selectedDay: computed(() => store.getSelectedDay),
      selectedWeek: computed(() => store.getSelectedWeek),
      updateSelectedDay
    }
  }
})

</script>

<style scoped>

</style>