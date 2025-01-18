<template>
  <el-card>
    <div v-if="isError">
      <el-alert type="error" :title="error?.message"/>
    </div>
    <template #header>
      <div class="header-content" v-if="props.memo">
        <h2 class="memo-title">
          {{ props.memo }}
        </h2>
        <div>
          <MemoBudgetCategory :memo="props.memo"/>
        </div>
      </div>
    </template>

    <el-table v-if="data" :data="[data]" table-layout="auto" :loading="isFetching">
      <el-table-column v-for="column in columns" :key="column.prop" :prop="column.prop" :label="column.label">
        <template v-if="column.prop === 'sumAmountDebit'" #default="scope">
          <el-statistic :value="scope.row.sum_amount_debit" data-testid="sum-amount-debit"/>
        </template>
        <template v-else-if="column.prop === 'transactionsCount'" #default="scope">
          <el-statistic :value="scope.row.transactions_count" data-testid="transactions-count"/>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <MemoTransactionsTable :memo="props.memo"/>
  <BackButton/>
</template>

<script setup lang="ts">
import {ElCard, ElStatistic, ElTable, ElTableColumn} from "element-plus";
import type {Memo} from "@types";
import useMemoSummary from "@api/hooks/transactions/useMemoSummary";
import {type PropType, watch} from "vue";
import MemoTransactionsTable from "@components/transactions/MemoTransactionsTable.vue";
import MemoBudgetCategory from "@components/transactions/MemoBudgetCategory.vue";
import BackButton from "@components/shared/BackButton.vue";

const props = defineProps(
    {
      memo: {
        type: Object as PropType<Memo>,
        required: true,
      },
    }
);

console.log('props.memo', props.memo);
console.log('typeof props.memo', typeof props.memo);

const {data, refetch, isFetching, isError, error} = useMemoSummary(props.memo);

const columns = [
  {prop: 'sumAmountDebit', label: 'Sum Amount Debit'},
  {prop: 'transactionsCount', label: 'Transactions Count'},
];

watch(() => props.memo, () => {
  refetch();
});
</script>

<style scoped>
.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.memo-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>