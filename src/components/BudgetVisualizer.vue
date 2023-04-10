<template>
    <h2>
        <el-icon style="vertical-align: middle">
            <TrendCharts/>
        </el-icon>
        Budget Visualizer
    </h2>

    <el-row :gutter="20">
        <el-col :span="4">
            <TransactionUploader/>
        </el-col>
    </el-row>
    <el-alert v-if="error" type="error" :title="'Error: ' + error">
        <h2>
            {{ error }}
        </h2>
    </el-alert>
    <br/>

    <MonthSelect
            :model="selectedMonth"
            @update:selectedMonth="selectedMonth = $event"
            :selected-value="selectedMonth"
    />

    <MemoSelect
            :model="selectedMemo"
            @update:selected-memo="selectedMemo = $event"
            :selected-value="selectedMemo"
    />

    <TransactionsTable
            :data="data"
            :columnKeys="columnKeys"
            :isFetching="isFetching"
            :LIMIT="LIMIT"
            :OFFSET="OFFSET"
            :incrementOffset="incrementOffset"
    />
</template>

<script lang="ts">
import {computed, defineComponent, ref, watch} from "vue";
import TransactionsTable from "./transactions/TransactionsTable.vue";
import TransactionUploader from "./transactions/TransactionUploader.vue";
import useTransactions from "../api/hooks/transactions/useTransactions";
import MonthSelect from "./transactions/MonthSelect.vue";
import MemoSelect from "./transactions/MemoSelect.vue";
import {TrendCharts} from "@element-plus/icons-vue";

const BudgetVisualizer = defineComponent({
    components: {
        TrendCharts,
        MemoSelect,
        MonthSelect,
        TransactionsTable,
        TransactionUploader,
    },

    setup() {
        const selectedMonth = ref('')
        const selectedMemo = ref('')

        // variables for paginating query
        const LIMIT = 100;
        const OFFSET = ref(0);

        function incrementOffset() {
            OFFSET.value += LIMIT;
        }

        const {data, error, isLoading, isFetching, refetch} = useTransactions(LIMIT, OFFSET.value, selectedMonth)

        const columnKeys = computed(() => {
            if (data.value && data.value.length > 0) {
                return Object.keys(data.value[0]);
            } else {
                return [];
            }
        });

        watch(selectedMonth, (newMonth) => {
            selectedMonth.value = newMonth;
            console.log('selectedMonth changed to: ' + selectedMonth.value);
            console.log('refetching data');
            refetch();
        })

        return {
            data,
            error,
            incrementOffset,
            isLoading,
            isFetching,
            selectedMonth,
            selectedMemo,
            LIMIT,
            OFFSET,
            columnKeys,
        };
    },
});
export default BudgetVisualizer;
</script>

<style scoped>
</style>
