<template>
    <el-card>
        <el-table :data="[monthSummaryData]" table-layout="auto" :loading="isFetching">
            <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label">
                <template v-if="column.prop === 'memo'" #default="scope">
                    <el-statistic :title="column.label" :value="scope.row.memo" data-testid="memo-month-summary"/>
                </template>
                <template v-if="column.prop === 'monthlyAmountDebit'" #default="scope">
                    <el-statistic :title="column.label" :value="scope.row.monthly_amount_debit" data-testid="monthly-amount-debit"/>
                </template>
            </el-table-column>
        </el-table>
    </el-card>

</template>

<script lang="ts">
import {computed, defineComponent, watch} from 'vue'
import {ElCard, ElStatistic, ElTable, ElTableColumn} from "element-plus";
import {useTransactionsStore} from "../../stores/transactionsStore";
import useMonthSummary from "../../api/hooks/transactions/useMonthSummary";

export default defineComponent({
    name: "MonthSummaryTable",
    components: {
        ElCard,
        ElStatistic,
      ElTable,
      ElTableColumn
    },
    setup() {

        const store = useTransactionsStore()

        const selectedMonth = computed(() => store.getSelectedMonth)

        const {data: monthSummaryData, isError, refetch, isFetching, isLoading, error} = useMonthSummary()

        const columns = [
            {prop: 'memo', label: 'Memo'},
            {prop: 'monthlyAmountDebit', label: 'Monthly Amount Debit'},
        ];

        watch(() => store.selectedMonth, () => {
            refetch();
        });

        return {monthSummaryData, isError, refetch, isFetching, isLoading, error, columns}
    }
})

</script>


<style scoped>

</style>