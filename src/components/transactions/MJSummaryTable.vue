<template>
  <el-card>
    <el-alert v-if="isError" type="error" :title="error?.message"/>
    <template #header>
      <div class="header-container">
        <h3>MJ Total for: {{ selectedMonth }}</h3>
        <!--        TODO use StatisticComponent -->
        <el-statistic
            v-if="data"
            size="large"
            :value="statisticValue"
            title="Total Amount Debit"
            v-loading="isLoading || isFetching || isRefetching"
        />
      </div>
    </template>
    <MJPrevSummaries/>
  </el-card>
</template>

<script setup lang="ts">
import {computed, watch, onMounted} from "vue";
import {ElCard, ElStatistic} from "element-plus";
import useMJAmountDebit from "@api/hooks/transactions/useMJAmountDebit";
import {useTransactionsStore} from "@stores/transactions";
import MJPrevSummaries from "./MJPrevSummaries.vue";
import type {OFSummary} from "@types";

const store = useTransactionsStore();

const selectedWeek = computed(() => store.getSelectedWeek);
const selectedMonth = computed(() => store.getSelectedMonth);

const {data, isLoading, isFetching, isError, error, refetch, isRefetching} = useMJAmountDebit();

const dataItems = computed(() => data.value as unknown as OFSummary[])

const statisticValue = computed(() => {
  if (!dataItems.value || !dataItems.value.length) {
    return 0;
  } else {
    return dataItems.value[0].total_debit;
  }
});

watch(() => [selectedMonth.value, selectedWeek.value], () => {
  refetch();
});

onMounted(async () => {
  await refetch();
});

</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>