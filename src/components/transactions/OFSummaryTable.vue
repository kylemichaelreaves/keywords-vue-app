<template>
  <el-card>
    <template #header>
      <div class="header-container">
        <h3>OF Total for {{ selectedMonth }}:</h3>
        <el-alert v-if="isError" type="error" :title="error?.message"/>
        <el-statistic
            size="large"
            :value="statisticValue"
            title="Total Amount Debit"
            v-loading="isLoading || isFetching || isRefetching"/>
      </div>
    </template>
        <OFPrevSummaries/>
  </el-card>
</template>

<script setup lang="ts">
import {computed, onMounted, watch} from "vue";
import useOFAmountDebit from "@api/hooks/transactions/useOFAmountDebit";
import {ElCard, ElStatistic} from "element-plus";
import {useTransactionsStore} from "@stores/transactions";
import OFPrevSummaries from "./OFPrevSummaries.vue";
import type {OFSummary} from "@types";


const {data, isLoading, isFetching, isError, error, refetch, isRefetching} = useOFAmountDebit();

const dataItems = computed(() => data.value as unknown as OFSummary[]);

const store = useTransactionsStore();

const selectedWeek = computed(() => store.getSelectedWeek);
const selectedMonth = computed(() => store.getSelectedMonth);

const statisticValue = computed(() => {
  if (!dataItems.value) {
    return 0;
  } else {
    return dataItems.value[0].total_debit;
  }
});

watch(() => [store.selectedMonth, store.selectedWeek], () => {
  refetch();
});

onMounted(() => {
  refetch();
});

</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>