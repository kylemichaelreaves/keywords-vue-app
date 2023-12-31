<template>
  <SelectComponent
      :options="weekOptions"
      :selectedValue="selectedWeek"
      placeholder="select a week"
      :onChange="updateSelectedWeek"
      :disabled="!!selectedMonth"
  />
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, watch} from "vue";
import {useWeeks} from "@api/hooks/transactions/useWeeks"
import {useTransactionsStore} from "@stores/transactions";
import SelectComponent from "@components/shared/SelectComponent.vue";

export default defineComponent({
  name: 'WeekSelect',
  components: {SelectComponent},
  setup() {
    const store = useTransactionsStore();

    const selectedWeek = computed(() => store.getSelectedWeek);
    const selectedMonth = computed(() => store.getSelectedMonth)

    const {data, isLoading, isFetching, isError, error, refetch} = useWeeks();

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

    onMounted(() => {
      if (data.value) {
        store.setWeeks(data.value)
      }
    })

    // if there's a selectedMonth, the options should be repopulated with the weeks of that month
    watch(selectedMonth, (newVal, oldVal) => {
      if (newVal) {
        store.setSelectedWeek('')
        refetch()
      }
    })

    return {
      data,
      selectedWeek,
      selectedMonth,
      weekOptions,
      updateSelectedWeek,
      isLoading,
      isFetching,
      isError,
      error
    }
  }
})
</script>


<style scoped>
</style>
