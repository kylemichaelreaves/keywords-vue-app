<template>
  <el-card>
    <template #header>
      <el-text>Memo Summary for:</el-text>
      <div class="header-content">
        <h2 v-if="selectedMemo">
          {{ selectedMemo }}
        </h2>
        <el-button round type="info" :icon="Close" @click="resetSelectedMemo"/>
      </div>
    </template>
    <el-table v-if="memoTableData" :data="[memoTableData]" table-layout="auto" :loading="isFetching">
      <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label">
        <template v-if="column.prop === 'sumAmountDebit'" #default="scope">
          <el-statistic :value="scope.row.sum_amount_debit" data-testid="sum-amount-debit"/>
        </template>
        <template v-if="column.prop === 'transactionsCount'" #default="scope">
          <el-statistic :value="scope.row.transactions_count"
                        data-testid="transactions-count"/>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <!--  TODO use TableComponent -->
  <!--  TODO add another column, somewhere, which will be populated with MemoSumTotalTable -->
  <!--  TODO if this Memo doesn't have a BudgetCategory in the memo table, display the Assign Budget Category button -->
  <!--  TODO use a useMutation to send the Memo back to the Memos table with a BudgetCategory -->
</template>

<script lang="ts">
import {computed, defineComponent, watch} from "vue";
import {ElCard, ElStatistic, ElTable, ElTableColumn} from "element-plus";
import useMemoSummary from "@api/hooks/transactions/useMemoSummary";
import {useTransactionsStore} from "@stores/transactions";
import {Close} from "@element-plus/icons-vue";

export default defineComponent({
  name: "MemoSummaryTable",
  components: {
    ElStatistic,
    ElCard,
    ElTable,
    ElTableColumn,
    Close
  },
  setup() {

    const store = useTransactionsStore();
    const selectedMemo = computed(() => store.getSelectedMemo);

    const {data: memoTableData, refetch, isFetching} = useMemoSummary();

    const columns = [
      {prop: 'sumAmountDebit', label: 'Sum Amount Debit'},
      {prop: 'transactionsCount', label: 'Transactions Count'},
    ];

    const resetSelectedMemo = () => {
      store.setSelectedMemo('');
    }

    watch(() => selectedMemo, () => {
      refetch();
    });

    return {memoTableData, columns, isFetching, selectedMemo, Close, resetSelectedMemo};
  }
})
</script>

<style scoped>
.header-content {
  display: flex;
  align-content: center;
  align-items: center;
  justify-content: start;
  gap: 1rem;
}
</style>
