<template>
  <el-card>
    <AlertComponent v-if="isError && error" :title="error.name" :message="error?.message" type="error"/>
    <template #header>
      <div class="card-header">
        <div class="summary-left">
          <h2>Month Summary for: {{ selectedMonth }}</h2>
          <MonthlyAmountDebitTotal/>
        </div>
        <NavigationButtonGroup
            label="Month"
            :is-last="isLastMonth"
            :is-first="isFirstMonth"
            :go-to-next="goToNextMonth"
            :go-to-previous="goToPreviousMonth"
            :reset="resetSelectedMonth"
        />
      </div>
    </template>


    <el-row>
      <el-col :span="12">
        <!-- TODO use TableComponent -->
        <!-- TODO sortable el-column, the column is Total Amount Debit -->
        <el-table
            v-if="data"
            :data="data"
            :default-sort="{prop: 'total_amount_debit', order: 'ascending'}"
            size="small"
            table-layout="fixed"
            v-loading="isFetching || isLoading || isRefetching"
            show-summary
            sortable
        >
          <el-table-column
              v-for="column in columns"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
          >
            <template v-slot="scope" v-if="column.prop === 'memo'">
              <router-link :to="{ name: 'memo', params: { memo: scope.row[column.prop] }}">
                {{ scope.row.memo }}
              </router-link>
            </template>
            <template v-slot="scope" v-else>
              {{ scope.row[column.prop] }}
            </template>
          </el-table-column>
        </el-table>
      </el-col>
      <el-col :span="12">
        <CarBudgetSummaryTable/>
        <OFSummaryTable/>
        <MJSummaryTable/>
        <MonthsSummaryTable/>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup lang="ts">
import {
  computed,
  onBeforeUnmount,
  onMounted,
  watch
} from 'vue'
import {ElCard, ElTable, ElTableColumn} from "element-plus";
import {useTransactionsStore} from "@stores/transactions";
import useMonthSummary from "@api/hooks/transactions/useMonthSummary";
import type {MonthYear} from "@types";
import OFSummaryTable from "@components/transactions/OFSummaryTable.vue";
import MJSummaryTable from "@components/transactions/MJSummaryTable.vue";
import MonthsSummaryTable from "@components/transactions/MonthsSummaryTable.vue";
import AlertComponent from "@components/shared/AlertComponent.vue";
import {router} from "@main";
import CarBudgetSummaryTable from "@components/transactions/CarBudgetSummaryTable.vue";
import MonthlyAmountDebitTotal from "@components/transactions/MonthlyAmountDebitTotal.vue";
import NavigationButtonGroup from "@components/shared/NavigationButtonGroup.vue";


const store = useTransactionsStore()
const selectedMonth = computed(() => store.getSelectedMonth)
const months = computed(() => store.getMonths)

const {data, isError, refetch, isFetching, isRefetching, isLoading, error} = useMonthSummary()

const columns = [
  {prop: 'memo', label: 'Memo'},
  {prop: 'total_amount_debit', label: 'Total Amount Debit'},
];

const firstMonth = months.value[0]?.month_year;
const lastMonth = months.value[months.value.length - 1]?.month_year;

// first, meaning: the most recent month
const isFirstMonth = computed(() => {
  return firstMonth === selectedMonth.value;
});

// last, meaning: the oldest month
const isLastMonth = computed(() => {
  return lastMonth === selectedMonth.value;
});

const goToPreviousMonth = () => {
  const selectedMonth = store.getSelectedMonth;
  const months = store.getMonths;

  if (selectedMonth && months.some((month: MonthYear) => month.month_year === selectedMonth)) {
    const currentIndex = months.findIndex((month: MonthYear) => month.month_year === selectedMonth);
    const newIndex = currentIndex + 1;

    if (newIndex >= 0 && newIndex < months.length) {
      const adjustedMonth = months[newIndex].month_year;
      store.setSelectedMonth(adjustedMonth);
    }
  }
};

const goToNextMonth = () => {
  const selectedMonth = store.getSelectedMonth;
  const months = store.getMonths;

  if (selectedMonth && months.some((month: MonthYear) => month.month_year === selectedMonth)) {
    const currentIndex = months.findIndex((month: MonthYear) => month.month_year === selectedMonth);
    const newIndex = currentIndex - 1;

    if (newIndex >= 0 && newIndex < months.length) {
      const adjustedMonth = months[newIndex].month_year;
      store.setSelectedMonth(adjustedMonth);
    }
  }
};

const resetSelectedMonth = () => {
  store.setSelectedMonth('');
  router.push({name: 'transactions'});
}

watch(selectedMonth, (newMonth) => {
  if (newMonth) {
    refetch();
  }
});

onMounted(() => {
  refetch();
});

onBeforeUnmount(() => {
  //   reset the transactionsPageLimit to the default value
  store.setTransactionsTableLimit(100)
});


</script>


<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-left {
  display: flex;
  align-items: center;
  gap: 2.5rem;
}
</style>