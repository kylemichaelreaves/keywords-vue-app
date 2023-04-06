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

    <CustomSelect
        placeholder="select a month"
        :selected-value="selectedMonth"
        :options="uniqueMonthsObject"
        @update:model-value="selectedMonth = $event"
        filterable
        clearable
    />

    <CustomSelect
        placeholder="select a memo"
        :selected-value="selectedMemo"
        :options="uniqueMemoObject"
        @update:model-value="selectedMemo = $event"
        filterable
        clearable
    />

    <TransactionsTable
            :tableColumns="transactionTableColumns"
            :displayData="displayData.rows"
            :uniqueMemoObject="uniqueMemoObject"
            :uniqueMonthsObject="uniqueMonthsObject"
            :selectedMemo="selectedMemo"
            :selectedMonth="selectedMonth"
            @update:selectedMemo="selectedMemo = $event"
            @update:selectedMonth="selectedMonth = $event"
            :incrementOffset="incrementOffset"
            :isFetching="isFetching"
            :linked-columns="['transactionNumber']"
    />
</template>

<script lang="ts">
import {computed, defineComponent, reactive, ref, watchEffect} from "vue";
import TransactionsTable from "./transactions/TransactionsTable.vue";
import TransactionUploader from "./transactions/TransactionUploader.vue";
import {useQuery} from "@tanstack/vue-query";
import {Transaction} from "../types";
import {fetchTransactionsRDS} from "../api/transactions/fetchTransactionsRDS";
import {filterDataByMonth, sumDebits, filterDataByMemo} from '../dataUtils';
import {TrendCharts} from "@element-plus/icons-vue";
import {useMemosByDate} from "../api/transactions/hooks/useMemosByDate";
import DateAndMemoFilter from "./address/DateAndMemoFilter.vue";
import CustomSelect from "./shared/CustomSelect.vue";
import {transactionTableColumns} from "./transactions/transactionsTableColumns";

const BudgetVisualizer = defineComponent({
    components: {
        CustomSelect,
        DateAndMemoFilter,
        TrendCharts,
        TransactionsTable,
        TransactionUploader,
    },

    setup() {
        const headers = ref([]);
        const displayData = reactive({rows: ref<Transaction[]>([])});
        const selectedMonth = ref('')
        const selectedMemo = ref('')

        // variables for paginating query
        const LIMIT = 100;
        const OFFSET = ref(0);

        function incrementOffset() {
            OFFSET.value += LIMIT;
        }



        const {data, error, isLoading, isFetching} = useQuery(
            ['transactions', LIMIT, OFFSET],
            () => fetchTransactionsRDS(LIMIT, OFFSET.value),
            {
                keepPreviousData: true,
                refetchOnWindowFocus: false,
            }
        )

        const uniqueMonthsArray = computed(() => {
            return new Set(
                filteredMemoDataAndMonth.value.memoData
                    .filter((d: Transaction) => d.date !== undefined)
                    .map((d: Transaction) => d.date.split("/")[0] + "/" + d.date.split("/")[2])
            );
        });

        // the options for the Date dropdown
        const uniqueMonthsObject = computed(() => {
            return Array.from(uniqueMonthsArray.value).map((month: string) => {
                return {
                    value: month,
                    label: month
                };
            });
        });

        const filteredMemoDataAndMonth = computed(() => {
            return {
                memoData: transactionsFilteredByMonthAndMemo.value,
                month: selectedMonth.value
            };
        });

        // the Memos are filtered by the selectedMonth if there is one
        const transactionsFilteredByMonth = computed(() => {
            if (selectedMonth.value && displayData.rows) {
                return displayData.rows.filter((d: Transaction) =>
                    `${d.date.split('/')[0]}/${d.date.split('/')[2]}` === selectedMonth.value
                );
            } else {
                return displayData.rows;
            }
        });

        // create a new computed property to store the filtered data
        const transactionsFilteredByMonthAndMemo = computed(() => {
            let filteredData = data.value || [];
            if (selectedMonth.value) {
                filteredData = filteredData.filter((d: Transaction) =>
                    `${d.date.split('/')[0]}/${d.date.split('/')[2]}` === selectedMonth.value
                );
            }
            return filteredData;
        });

        // use the filteredData computed property in uniqueMemoArray
        const uniqueMemoArray = computed(() => {
            // remove blank and undefined values
            return [
                ...new Set(filteredMemoDataAndMonth.value.memoData.map((d: Transaction) => d.memo))
            ].filter(memo => memo);
        });

        // builds the options of the Memo select
        const filteredMemoOptions = computed(() => {
            return [...new Set(transactionsFilteredByMonth.value.map((d: Transaction) => d.memo))]
                .filter((memo) => memo)
                .map((memo) => {
                    return {
                        value: memo,
                        label: memo
                    };
                });
        });

        const filterTransactions = computed(() => {
            let filteredData = data.value || [];
            filteredData = filterDataByMonth(filteredData, selectedMonth.value);
            filteredData = filterDataByMemo(filteredData, selectedMemo.value);
            return filteredData;
        });


        const sumDebitsByMonth = computed(() => {
            const data = transactionsFilteredByMonthAndMemo.value;
            const debitsObj = sumDebits(data, 'month');
            return Object.keys(debitsObj).map((date) => ({date, amount: debitsObj[date]}));
        });


        const sumDebitsByDay = computed(() => {
            const data = transactionsFilteredByMonthAndMemo.value;
            const debitsObj = sumDebits(data, 'day');
            return Object.keys(debitsObj).map((date) => ({date, amount: debitsObj[date]}));
        });

        const memosByDate = useMemosByDate(filterTransactions);

        watchEffect(() => {
            displayData.rows = filterTransactions.value;
        });

        watchEffect(() => {
            console.log('uniqueMonthsObject', uniqueMonthsObject.value)
        })

        return {
            sumDebitsByMonth,
            sumDebitsByDay,
            displayData,
            error,
            filterData: filterTransactions,
            headers,
            incrementOffset,
            isLoading,
            isFetching,
            memosByDate,
            selectedMonth,
            selectedMemo,
            transactionTableColumns,
            uniqueMonthsArray,
            uniqueMemoArray,
            uniqueMonthsObject,
            uniqueMemoObject: filteredMemoOptions,
        };
    },
});
export default BudgetVisualizer;
</script>

<style scoped>
</style>