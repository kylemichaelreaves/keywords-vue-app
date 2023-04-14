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
            @update:selectedMonth="updateSelectedMonth($event)"
            :selected-value="selectedMonth"
    />

    <MemoSelect
            @update:selected-memo="updateSelectedMemo($event)"
            :selected-value="selectedMemo"
    />

    <TransactionsTable
            :tableData="data"
            :columnKeys="columnKeys"
            :isFetching="isFetching"
            :LIMIT="LIMIT"
            :OFFSET="OFFSET"
            :incrementOffset="incrementOffset"
    />
</template>

<script lang="ts">
import {computed, defineComponent, ref, watch, watchEffect} from "vue";
import TransactionsTable from "./transactions/TransactionsTable.vue";
import TransactionUploader from "./transactions/TransactionUploader.vue";
import useTransactions from "../api/hooks/transactions/useTransactions";
import MonthSelect from "./transactions/MonthSelect.vue";
import MemoSelect from "./transactions/MemoSelect.vue";
import {TrendCharts} from "@element-plus/icons-vue";
import {useTransactionsStore} from "../stores/transactionsStore";

const BudgetVisualizer = defineComponent({
    components: {
        TrendCharts,
        MemoSelect,
        MonthSelect,
        TransactionsTable,
        TransactionUploader,
    },

    setup() {
        const store = useTransactionsStore();

        const updateSelectedMonth = (newMonth: string) => {
            store.setSelectedMonth(newMonth);
        };

        const updateSelectedMemo = (newMemo: string) => {
            store.setSelectedMemo(newMemo);
        };

        // variables for paginating query
        const LIMIT = 100;
        const OFFSET = ref(0);

        function incrementOffset() {
            OFFSET.value += LIMIT;
        }

        const {
            data,
            error,
            isLoading,
            isFetching,
            refetch
        } = useTransactions(LIMIT, OFFSET.value)

        const columnKeys = computed(() => {
            if (data.value && data.value.length > 0) {
                return Object.keys(data.value[0]);
            } else {
                return [];
            }
        });

        watch(() => store.selectedMonth, (newMonth: string) => {
            store.setSelectedMonth(newMonth);
            console.log("selectedMonth changed to: ", newMonth);
            console.log("refetching data");
            refetch();
        });

        watchEffect(() => {
            console.log("BudgetVisualizer data updated:", data.value);
        });

        return {
            data,
            error,
            incrementOffset,
            isLoading,
            isFetching,
            selectedMonth: computed(() => store.getSelectedMonth),
            selectedMemo: computed(() => store.getSelectedMemo),
            LIMIT,
            OFFSET,
            columnKeys,
            updateSelectedMonth,
            updateSelectedMemo,
        };
    },
});
export default BudgetVisualizer;
</script>

<style scoped>
</style>
