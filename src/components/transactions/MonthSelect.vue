<template>
  <AlertComponent :title="error.name" :message="error.message" type="error" v-if="isError && error"/>
  <SelectComponent
      :options="monthOptions"
      :selectedValue="store.selectedMonth"
      placeholder="select a month"
      :disabled="isLoading || isFetching"
      :onChange="updateSelectedMonth"
  />
</template>

<script setup lang="ts">
import {computed, onMounted, watch} from 'vue'
import {useMonths} from "@api/hooks/transactions/useMonths";
import type {MonthYear} from "@types";
import {useTransactionsStore} from "@stores/transactions";
import SelectComponent from "@components/shared/SelectComponent.vue";
import {router} from "@main";
import AlertComponent from "@components/shared/AlertComponent.vue";


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
        router.push({name: 'month-summary', params: {month: newMonth}});
      }
    }
);

onMounted(() => {
  if (data.value) {
    store.setMonths(data.value)
  }
});


</script>

<style scoped>
</style>