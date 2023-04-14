<template>
    <el-select
            ref="selectComponent"
            v-model="selectedMonth"
            placeholder="select month"
            @update:model-value="updateSelectedMonth"
            clearable
            filterable
    >
        <el-option
                v-for="option in transformedData"
                :key="option.value"
                :label="option.label"
                :value="option.value"
                data-testid="month-option"
        />
    </el-select>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue'
import {useMonths} from "../../api/hooks/transactions/useMonths";
import {ElOption, ElSelect} from "element-plus";
import {MonthYear} from "../../types";
import {useTransactionsStore} from "../../stores/transactionsStore";

export default defineComponent({
    name: "MonthSelect",
    components: {ElSelect, ElOption},
    props: {
        selectedMonth: {
            type: String,
            default: ''
        }
    },
    setup(props) {

        const transactionsStore = useTransactionsStore()

        const selectedMonth = transactionsStore.getSelectedMonth

        const {data, isFetching, isLoading, isError, error} = useMonths()

        const transformedData = computed(() => {
            if (!data.value) {
                return []
            }
            return data.value.map((item: MonthYear) => ({
                value: item.month_year,
                label: item.month_year,
            }));
        });

        const updateSelectedMonth = (month: string) => {
            transactionsStore.setSelectedMonth(month)
        }

        return {
            data,
            transformedData,
            isFetching,
            isLoading,
            isError,
            error,
            selectedMonth,
            updateSelectedMonth
        }
    }
})
</script>

<style scoped>

</style>
