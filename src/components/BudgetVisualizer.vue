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

    <WeekSelect
            @update:selected-week="updateSelectedWeek($event)"
            :selected-value="selectedWeek"
    />

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
import {computed, defineComponent, ref, watch} from "vue";
import TransactionsTable from "./transactions/TransactionsTable.vue";
import TransactionUploader from "./transactions/TransactionUploader.vue";
import useTransactions from "../api/hooks/transactions/useTransactions";
import MonthSelect from "./transactions/MonthSelect.vue";
import MemoSelect from "./transactions/MemoSelect.vue";
import {TrendCharts} from "@element-plus/icons-vue";
import {useTransactionsStore} from "../stores/transactionsStore";
import WeekSelect from "./transactions/WeekSelect.vue";

const BudgetVisualizer = defineComponent({
    components: {
        WeekSelect,
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

        const updateSelectedWeek = (newWeek: string) => {
            store.setSelectedWeek(newWeek);
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
        //     since we're storing the selectedMonth, we don't need to pass it as a variable
        } = useTransactions(LIMIT, OFFSET.value)

        const columnKeys = computed(() => {
            if (data.value && data.value.length > 0) {
                return Object.keys(data.value[0]).filter(key => key !== 'Check Number' && key !== 'Fees');
            } else {
                return [];
            }
        });

        watch(() => store.selectedMonth, (newMonth: string) => {
            // if there's a selectedWeek, reset it
            if (store.selectedWeek) {
                store.setSelectedWeek('');
            }
            store.setSelectedMonth(newMonth);
            refetch();
        });

        watch(() => store.selectedMemo, (newMemo: string) => {
            store.setSelectedMemo(newMemo);
            refetch();
        });

        watch(() => store.selectedWeek, (newWeek: string) => {
            // If there's a selectedWeek, the selectedMonth needs to be reset
            // first check if there's a selectedMonth
            if (store.selectedMonth) {
                store.setSelectedMonth('');
            }
            store.setSelectedMonth('');
            store.setSelectedWeek(newWeek);
            refetch();
        });

        return {
            data,
            error,
            incrementOffset,
            isLoading,
            isFetching,
            selectedMonth: computed(() => store.getSelectedMonth),
            selectedMemo: computed(() => store.getSelectedMemo),
            selectedWeek: computed(() => store.getSelectedWeek),
            LIMIT,
            OFFSET,
            columnKeys,
            updateSelectedMonth,
            updateSelectedMemo,
            updateSelectedWeek,
        };
    },
});
export default BudgetVisualizer;
</script>

<style scoped>
</style>
