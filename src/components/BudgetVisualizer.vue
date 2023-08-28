<template>
  <el-card class="dark">
    <template #header>
      <h2>
        <el-icon style="vertical-align: middle">
          <TrendCharts/>
        </el-icon>
        Budget Visualizer
      </h2>
    </template>

    <el-row style="justify-content: space-between">
      <el-col>
        <MemoSummaryTable v-if="selectedMemo"/>
      </el-col>
      <el-col>
        <Suspense>
          <MonthSummaryTable v-if="selectedMonth"/>
        </Suspense>
      </el-col>
      <el-col>
        <WeekSummaryTable v-if="selectedWeek"/>
      </el-col>
    </el-row>
    <el-alert v-if="error" type="error" :title="'Error: ' + error">
      <h2>
        {{ error }}
      </h2>
    </el-alert>
    <br/>

    <el-row style="justify-content: space-between">
      <el-col :span="15">
        <WeekSelect
            @update:selected-week="updateSelectedWeek($event)"
            :selected-value="selectedWeek"
        />
        <MonthSelect
            @update:selected-month="updateSelectedMonth($event)"
            :selected-value="selectedMonth"
        />
        <MemoSelect
            @update:selected-memo="updateSelectedMemo($event)"
            :selected-value="selectedMemo"
        />
      </el-col>

    </el-row>


    <TransactionsTable
        v-if="data"
        :tableData="data"
        :columnKeys="columnKeys"
        :isFetching="isFetching"
        :LIMIT="LIMIT"
        :OFFSET="OFFSET"
        :incrementOffset="incrementOffset"
        :loading="isFetching || isLoading"
    />
  </el-card>

  <router-view :key="$route.fullPath"></router-view>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, ref, watch} from "vue";
import TransactionsTable from "./transactions/TransactionsTable.vue";
import TransactionUploader from "./transactions/TransactionUploader.vue";
import useTransactions from "@api/hooks/transactions/useTransactions";
import MonthSelect from "./transactions/MonthSelect.vue";
import MemoSelect from "./transactions/MemoSelect.vue";
import {TrendCharts} from "@element-plus/icons-vue";
import {useTransactionsStore} from "@stores/transactions";
import MemoSummaryTable from "./transactions/MemoSummaryTable.vue";
import WeekSelect from "./transactions/WeekSelect.vue";
import WeekSummaryTable from "./transactions/WeekSummaryTable.vue";
import MonthSummaryTable from "./transactions/MonthSummaryTable.vue";
import TransactionTypeToggle from "./transactions/TransactionTypeToggle.vue";

export default defineComponent({
  name: "BudgetVisualizer",
  components: {
    MemoSummaryTable,
    MonthSummaryTable,
    WeekSummaryTable,
    TrendCharts,
    MemoSelect,
    MonthSelect,
    WeekSelect,
    TransactionsTable,
    TransactionUploader,
    TransactionTypeToggle
  },

  setup() {
    const store = useTransactionsStore();
    const LIMIT = 100;
    const OFFSET = ref(0);
    const {
      data,
      error,
      isLoading,
      isFetching,
      refetch
    } = useTransactions(LIMIT, OFFSET.value);

    const updateSelectedMonth = (newMonth: string) => {
      store.setSelectedMonth(newMonth);
      refetch()
    };

    const updateSelectedMemo = (newMemo: string) => {
      store.setSelectedMemo(newMemo);
      refetch();
    };

    const updateSelectedWeek = (newWeek: string) => {
      store.setSelectedWeek(newWeek);
      refetch();
    };

    function incrementOffset() {
      OFFSET.value += LIMIT;
      refetch();
    }

    const columnKeys = computed(() => {
      if (data?.value && data?.value.length > 0) {
        console.log("Column keys: ", Object.keys(data?.value[0]))
        return Object.keys(data?.value[0]).filter(key => key !== 'Check Number' && key !== 'Fees');
      } else {
        return [];
      }
    });

    watch(() => store.selectedMemo, () => {
      refetch();
    });

    watch(() => store.selectedMonth, () => {
      refetch();
    });

    watch(() => store.selectedWeek, () => {
      refetch();
    });

    onMounted(() => {
      refetch();
    });

    return {
      data,
      error,
      incrementOffset,
      isLoading,
      isFetching,
      selectedWeek: computed(() => store.getSelectedWeek),
      selectedMonth: computed(() => store.getSelectedMonth),
      selectedMemo: computed(() => store.getSelectedMemo),
      LIMIT,
      OFFSET,
      columnKeys,
      updateSelectedMonth,
      updateSelectedMemo,
      updateSelectedWeek,
    };
  },
});
</script>

<style scoped>
.dark {
  background-color: #383838;
  color: #ecf0f1;
}
</style>
