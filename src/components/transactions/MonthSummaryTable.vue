<!--Write unit tests for this Vue component with vitest and vue-utils-->
<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <h3>Month Summary: {{ selectedMonth }}</h3>
        <el-button-group>
          <el-button type="primary" :icon="ArrowLeft.value" @click="goToPreviousMonth" :disabled="isLastMonth">Previous Month
          </el-button>
          <el-button type="primary" :icon="ArrowRight.value" @click="goToNextMonth" :disabled="isFirstMonth">Next Month
          </el-button>
        </el-button-group>
      </div>
    </template>
    <el-row>
      <el-col :span="14">
        <el-table
            v-if="monthSummaryData && monthSummaryData.length > 0"
            :data="monthSummaryData"
            :default-sort="{prop: 'total_debit_amount', order: 'descending'}"
            size="small"
            table-layout="fixed"
            :loading="isFetching || isLoading"
            show-summary
        >
          <el-table-column
              v-for="column in columns"
              :key="column.prop"
              :prop="column.prop"
              :label="column.label"
          />
        </el-table>
      </el-col>
      <el-col :span="10">
        <OFSummaryTable/>
        <MJSummaryTable/>
        <MonthsSummaryTable v-if="selectedMonth"/>
      </el-col>
    </el-row>
  </el-card>
</template>

<script lang="ts">
import {computed, defineComponent, onMounted, watch} from 'vue'
import {ElCard, ElStatistic, ElTable, ElTableColumn} from "element-plus";
import {useTransactionsStore} from "@stores/transactions";
import useMonthSummary from "@api/hooks/transactions/useMonthSummary";
import OFSummaryTable from "./OFSummaryTable.vue";
import MJSummaryTable from "./MJSummaryTable.vue";
import MonthsSummaryTable from "./MonthsSummaryTable.vue";
import {ArrowLeft, ArrowRight} from "@element-plus/icons-vue";
import NavigationButtonGroup from "../shared/NavigationButtonGroup.vue";

export default defineComponent({
  name: "MonthSummaryTable",
  computed: {
    ArrowRight() {
      return ArrowRight
    },
    ArrowLeft() {
      return ArrowLeft
    }
  },
  components: {
    MJSummaryTable,
    OFSummaryTable,
    ElCard,
    ElStatistic,
    ElTable,
    ElTableColumn,
    ArrowLeft,
    NavigationButtonGroup,
    MonthsSummaryTable
  },
  async setup() {
    const store = useTransactionsStore()
    const selectedMonth = computed(() => store.getSelectedMonth)
    const months = computed(() => store.getMonths)


    const {data: monthSummaryData, isError, refetch, isFetching, isLoading, error} = useMonthSummary()

    const columns = [
      {prop: 'memo', label: 'Memo'},
      {prop: 'total_debit_amount', label: 'Total Amount Debit'},
    ];

    // first, meaning: the most recent month
    const isFirstMonth = computed(() => {
      return months.value[0]?.month_year === selectedMonth.value;
    });


    // last, meaning: the oldest month
    const isLastMonth = computed(() => {
      return months.value[months.value.length - 1]?.month_year === selectedMonth.value;
    });

    const adjustSelectedMonth = (adjustment: number) => {
      // Make sure selectedMonth is set and is present in months array
      if (selectedMonth.value && months.value.some(month => month.month_year === selectedMonth.value)) {
        const currentIndex = months.value.findIndex(month => month.month_year === selectedMonth.value);
        const newIndex = currentIndex + adjustment;
        // Ensure newIndex is within array bounds
        if (newIndex >= 0 && newIndex < months.value.length) {
          const newMonth = months.value[newIndex].month_year;
          store.setSelectedMonth(newMonth);
        }
      }
    };

    const goToPreviousMonth = () => {
      adjustSelectedMonth(1);
    };

    const goToNextMonth = () => {
      adjustSelectedMonth(-1);
    };

    watch(() => selectedMonth.value, async (newValue: string) => {
      await refetch();
      await store.fetchPrevSummaries();
    });

    onMounted(async () => {
      await store.fetchMonthsData()
      await store.fetchPrevSummaries();
    });

    return {
      monthSummaryData,
      isError,
      refetch,
      isFetching,
      isLoading,
      error,
      columns,
      selectedMonth,
      goToPreviousMonth,
      goToNextMonth,
      isFirstMonth,
      isLastMonth
    }
  }
})
</script>


<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>