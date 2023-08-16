<template>
  <el-select
      ref="selectComponent"
      :model-value="selectedMonth"
      placeholder="select month"
      @update:model-value="updateSelectedMonth($event)"
      :disabled="!!selectedMonth"
      clearable
      filterable
  >
    <el-option
        v-for="option in monthOptions"
        :key="option.value"
        :label="option.label"
        :value="option.value"
        data-testid="month-option"
    />
  </el-select>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted} from 'vue'
import {useMonths} from "@api/hooks/transactions/useMonths";
import {ElOption, ElSelect} from "element-plus";
import {MonthYear} from "@types/types";
import {useTransactionsStore} from "@stores/transactionsStore";

export default defineComponent({
  name: "MonthSelect",
  components: {ElSelect, ElOption},
  props: {
    selectedMonth: {
      type: String,
      default: ''
    }
  },
  setup() {

    const store = useTransactionsStore()
    // fetch months that will populate the dropdown from the results of this hook
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
      updateSelectedMonth
    }
  }
})
</script>

<style scoped>
</style>