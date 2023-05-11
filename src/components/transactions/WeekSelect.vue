<template>
  <el-select
    ref="selectComponent"
    v-model="selectedWeek"
    placeholder="select a week"
    @update:model-value="updateSelectedWeek"
    :disabled="selectedMonth.value !== ''"
    clearable
    filterable
    >
      <el-option
              v-for="option in weekOptions"
              :key="option.value"
              :label="option.label"
              :value="option.value"
          />
  </el-select>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import {useWeeks} from "../../api/hooks/transactions/useWeeks"
import {ElOption, ElSelect} from "element-plus"
import {useTransactionsStore} from "../../stores/transactionsStore";
import {select} from "d3";

export default defineComponent({
    name: 'WeekSelect',
    methods: {select},
    components: {ElOption, ElSelect},
    props: {
        selectedWeek: {
            type: String,
            default: ''
        }
    },
    setup() {
        const store = useTransactionsStore();

        const selectedWeek = computed(() => store.getSelectedMemo);

        const selectedMonth = computed(() => store.getSelectedMonth)

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

        return {
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
