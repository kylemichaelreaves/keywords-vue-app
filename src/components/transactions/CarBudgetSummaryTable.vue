<template>
  <el-card>
    <AlertComponent :title="error.name" :message="error.message" type="error" v-if="isError && error"/>
    <div class="header-container">
      <h3>Total Car Expenses for {{ selectedMonth }}</h3>
      <el-statistic
          v-if="data"
          :value="statisticValue"
          title="Total Amount Debit"
          v-loading="isLoading || isFetching || isRefetching"
      />
    </div>
  </el-card>
</template>

<script setup lang="ts">
import useCarBudgetAmountDebit from "@api/hooks/transactions/useCarBudgetAmountDebit";
import {useTransactionsStore} from "@stores/transactions";
import {type CarBudget} from "@types";
import AlertComponent from "@components/shared/AlertComponent.vue";
import {computed, watch} from "vue";


const store = useTransactionsStore();
const selectedMonth = computed(() => store.getSelectedMonth);


const {
  data,
  isLoading,
  isError,
  refetch,
  isFetching,
  isRefetching,
  error
} = useCarBudgetAmountDebit();

const dataItems = computed(() => data.value as unknown as CarBudget[]);

const statisticValue = computed(() => {
  if (!dataItems.value) {
    return 0;
  } else {
    return dataItems.value[0].total_amount_debit;
  }
});

watch(selectedMonth, (newMonth) => {
  if (newMonth) {
    refetch();
  }
});

</script>

<style scoped>
.header-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>