<template>
  <el-row style="justify-content: space-between">
    <!--      TODO add DaySummaryTable component-->
    <Suspense>
      <MemoSummaryTable v-if="selectedMemo"/>
    </Suspense>
    <Suspense>
      <MonthSummaryTable v-if="selectedMonth"/>
    </Suspense>
    <Suspense>
      <WeekSummaryTable v-if="selectedWeek"/>
    </Suspense>
  </el-row>

  <TransactionsTableSelects/>
</template>

<script lang="ts">
import {computed, defineComponent} from "vue";
import {useTransactionsStore} from "@stores/transactions";
import DaySummaryTable from "@components/transactions/DaySummaryTable.vue";
import MonthSummaryTable from "@components/transactions/MonthSummaryTable.vue";
import WeekSummaryTable from "@components/transactions/WeekSummaryTable.vue";
import MemoSummaryTable from "@components/transactions/MemoSummaryTable.vue";
import TransactionsTableSelects from "@components/transactions/TransactionsTableSelects.vue";

export default defineComponent({
  name: "TransactionsTableSummaryTables",
  components: {
    TransactionsTableSelects,
    MemoSummaryTable,
    MonthSummaryTable,
    WeekSummaryTable,
    DaySummaryTable,
  },
  setup() {
    const store = useTransactionsStore();

    return {
      selectedDay: computed(() => store.getSelectedDay),
      selectedWeek: computed(() => store.getSelectedWeek),
      selectedMonth: computed(() => store.getSelectedMonth),
      selectedYear: computed(() => store.getSelectedYear),
      selectedMemo: computed(() => store.getSelectedMemo,)
    };
  },
});


</script>

<style scoped>

</style>