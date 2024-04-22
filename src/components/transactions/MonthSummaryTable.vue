<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <h2>Month Summary for: {{ selectedMonth }}</h2>
        <el-button-group>
          <el-button
              type="primary"
              :icon="ArrowLeft"
              @click="goToPreviousMonth"
              :disabled="isLastMonth"
          >
            Previous Month
          </el-button>
          <el-button
              type="primary"
              :icon="ArrowRight"
              @click="goToNextMonth"
              :disabled="isFirstMonth"
          >
            Next Month
          </el-button>
          <el-button
              type="info"
              @click="resetSelectedMonth"
              :icon="Close"
          />
        </el-button-group>
      </div>
    </template>
    <el-row>
      <el-col :span="8">
        <!--        TODO use TableComponent     -->
        <el-table
            v-if="data"
            :data="data"
            :default-sort="{prop: 'total_amount_debit', order: 'descending'}"
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
          />
        </el-table>
      </el-col>
      <el-col :span="6">
        <OFSummaryTable/>
        <MJSummaryTable/>
      </el-col>
      <el-col :span="10">
        <MonthsSummaryTable/>
      </el-col>
    </el-row>
  </el-card>
</template>

<script lang="ts">
import {
  computed,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  watch
} from 'vue'
import {ElCard, ElStatistic, ElTable, ElTableColumn} from "element-plus";
import {useTransactionsStore} from "@stores/transactions";
import useMonthSummary from "@api/hooks/transactions/useMonthSummary";
import {ArrowLeft, ArrowRight, Close} from "@element-plus/icons-vue";
import NavigationButtonGroup from "../shared/NavigationButtonGroup.vue";
import type {MonthYear} from "@types";
import OFSummaryTable from "@components/transactions/OFSummaryTable.vue";
import MJSummaryTable from "@components/transactions/MJSummaryTable.vue";
import MonthsSummaryTable from "@components/transactions/MonthsSummaryTable.vue";
import {getWeekRange} from "@api/helpers/getWeekRange";


export default defineComponent({
  name: "MonthSummaryTable",
  methods: {getWeekRange},
  computed: {
    Close() {
      return Close
    },
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
  setup() {
    const store = useTransactionsStore()
    const selectedMonth = computed(() => store.getSelectedMonth)
    const months = computed(() => store.getMonths)
    const {data, isError, refetch, isFetching, isRefetching, isLoading, error, isRefetchError} = useMonthSummary()

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
    }

    watch(() => selectedMonth.value, async (newValue: string) => {
      await refetch();
      // await store.fetchPrevSummaries();
    });

    // TODO figure out why I did this in the first place
    onMounted(async () => {
      await refetch();
      // await store.fetchMonthsData();
      // await store.fetchPrevSummaries();
    });

    onBeforeUnmount(() => {
      //   reset the transactionsPageLimit to the default value
      store.updateTransactionsTableLimit(100)
    });

    return {
      data,
      isError,
      isRefetchError,
      refetch,
      isFetching,
      isLoading,
      isRefetching,
      error,
      columns,
      selectedMonth,
      goToPreviousMonth,
      goToNextMonth,
      isFirstMonth,
      isLastMonth,
      resetSelectedMonth,
      Close,
      months
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