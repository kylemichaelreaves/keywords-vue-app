<template>
    <el-card>
        <el-table v-i='weekSummaryData' :data="[weekSummaryData]" table-layout="auto" :loading="isFetching">
            <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label">
                <template v-if="column.prop === 'memo'" #default="scope">
                    <el-statistic :title="column.label" :value="scope.row.memo" data-testid="memo-week-summary"/>
                </template>
                <template v-if="column.prop === 'weeklyAmountDebit'" #default="scope">
                    <el-statistic :title="column.label" :value="scope.row.weekly_amount_debit"
                                  data-testid="weekly-amount-debit"/>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script lang="ts">
import {computed, defineComponent, watch} from 'vue'
import {ElCard, ElStatistic, ElTable, ElTableColumn} from "element-plus";
import {useTransactionsStore} from "../../stores/transactionsStore";
import useWeekSummary from "../../api/hooks/transactions/useWeekSummary";

export default defineComponent({
    name: "WeekSummaryTable",
    components: {
        ElCard,
        ElStatistic,
        ElTable,
        ElTableColumn
    },
    setup() {

        const store = useTransactionsStore()

        const selectedWeek = computed(() => store.getSelectedWeek)

        const {data: weekSummaryData, isError, refetch, isFetching, isLoading, error} = useWeekSummary()

        const columns = [
            {prop: 'memo', label: 'Memo'},
            {prop: 'weeklyAmountDebit', label: 'Weekly Amount Debit'},
        ];

        watch(() => store.selectedWeek, () => {
            refetch();
        });

        return {weekSummaryData, isError, refetch, isFetching, isLoading, error, columns}
    }
})
</script>

<style scoped>
</style>