<template>
    <el-card>
        <el-table v-if="memoTableData" :data="[memoTableData]" table-layout="auto" :loading="isFetching">
            <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label">
                <template v-if="column.prop === 'sumAmountDebit'" #default="scope">
                    <el-statistic title="Sum Amount Debit" :value="scope.row.sum_amount_debit" data-testid="sum-amount-debit"/>
                </template>
                <template v-if="column.prop === 'transactionsCount'" #default="scope">
                    <el-statistic title="Transactions Count" :value="scope.row.transactions_count" data-testid="transactions-count"/>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script lang="ts">
import {defineComponent, watch} from "vue";
import {ElCard, ElStatistic, ElTable, ElTableColumn} from "element-plus";
import useMemoSummary from "../../api/hooks/transactions/useMemoSummary";
import {useTransactionsStore} from "../../stores/transactionsStore";

export default defineComponent({
    name: "MemoSummaryTable",
    components: {
        ElStatistic,
        ElCard,
        ElTable,
        ElTableColumn
    },
    setup() {

        const store = useTransactionsStore();

        const {data: memoTableData, refetch, isFetching} = useMemoSummary();

        const columns = [
            {prop: 'sumAmountDebit', label: 'Sum Amount Debit'},
            {prop: 'transactionsCount', label: 'Transactions Count'},
        ];

        watch(() => store.selectedMemo, () => {
            refetch();
        });


        return {memoTableData, columns, isFetching};
    }
})
</script>

<style scoped>
</style>
