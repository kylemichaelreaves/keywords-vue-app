<template>
  <AlertComponent :title="error.name" :message="error.message" type="error" v-if="isError && error"/>
  <SelectComponent
      :options="weekOptions"
      :selectedValue="selectedWeek"
      placeholder="select a week"
      :onChange="updateSelectedWeek"
      :onClear="clearSelectedYear"
      :disabled="isLoading || isFetching"
  />
</template>

<script setup lang="ts">
import {computed} from "vue";
import {useWeeks} from "@api/hooks/transactions/useWeeks"
import {useTransactionsStore} from "@stores/transactions";
import SelectComponent from "@components/shared/SelectComponent.vue";
import AlertComponent from "@components/shared/AlertComponent.vue";


const store = useTransactionsStore();

const selectedWeek = computed(() => store.getSelectedWeek);

const {data, isLoading, isFetching, isError, error} = useWeeks();

const weekOptions = computed(() => {
  if (!data.value) {
    return []
  }
  return data.value.map(item => ({
    value: item.week_year,
    label: item.week_year
  }));
})

const updateSelectedWeek = (week: string) => {
  store.setSelectedWeek(week)
}

const clearSelectedYear = () => {
  store.setSelectedWeek('')
}


</script>


<style scoped>
</style>
