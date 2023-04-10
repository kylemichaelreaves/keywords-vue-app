<template>
    <el-select
        ref="selectComponent"
        v-model="selectedMonth"
        placeholder="select month"
        @update:model-value="$emit('update:selectedMonth', $event)"
        clearable
        filterable
    >
        <el-option
            v-for="option in transformedData"
            :key="option.value"
            :label="option.label"
            :value="option.value"
        />
    </el-select>
</template>

<script lang="ts">
import {computed, defineComponent, ref} from 'vue'
import {useMonths} from "../../api/hooks/transactions/useMonths";
import {ElOption, ElSelect} from "element-plus";
import {MonthYear} from "../../types";

export default defineComponent({
    name: "MonthSelect",
    components: {ElSelect, ElOption},
    emits: ['update:selectedMonth'],
    props: {
        selectedMonth: {
            type: String,
            default: ''
        }
    },
    setup(props) {

        const selectedMonth = props.selectedMonth

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

        return {
            data,
            transformedData,
            isFetching,
            isLoading,
            isError,
            error,
            selectedMonth
        }
    }
})
</script>

<style scoped>

</style>
