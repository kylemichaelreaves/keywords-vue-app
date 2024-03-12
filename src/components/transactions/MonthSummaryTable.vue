<template>
  <el-card>
    <template #header>
      <div class="card-header">
        <h2>Month Summary for: {{ selectedMonth }}</h2>
        <el-button-group>
          <el-button
              type="primary"
              :icon="ArrowLeft.value"
              @click="goToPreviousMonth"
              :disabled="isLastMonth"
          >
            Previous Month
          </el-button>
          <el-button
              type="primary"
              :icon="ArrowRight.value"
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
      <el-col :span="14">
        <!--        TODO use TableComponent     -->
        <el-table
            v-if="data"
            :data="data"
            :default-sort="{prop: 'total_amount_debit', order: 'descending'}"
            size="small"
            table-layout="fixed"
            :loading="isFetching || isLoading"
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
      <el-col :span="10">
        <OFSummaryTable/>
        <MJSummaryTable/>
        <MonthsSummaryTable/>
      </el-col>
    </el-row>
  </el-card>
</template>

<script lang="ts">
import {
  computed,
  type ComputedRef,
  defineComponent,
  onBeforeUnmount,
  onMounted,
  type Ref,
  watch
} from 'vue'
import {ElCard, ElStatistic, ElTable, ElTableColumn} from "element-plus";
import {useTransactionsStore} from "@stores/transactions";
import useMonthSummary from "@api/hooks/transactions/useMonthSummary";
import {ArrowLeft, ArrowRight, Close} from "@element-plus/icons-vue";
import NavigationButtonGroup from "../shared/NavigationButtonGroup.vue";
import type {MonthSummary, MonthYear} from "@types";
import OFSummaryTable from "@components/transactions/OFSummaryTable.vue";
import MJSummaryTable from "@components/transactions/MJSummaryTable.vue";
import MonthsSummaryTable from "@components/transactions/MonthsSummaryTable.vue";
import {goToNextMonth, goToPreviousMonth} from "@components/transactions/monthNavigation";
import type {QueryObserverResult, RefetchOptions} from "@tanstack/vue-query";


export default defineComponent({
  name: "MonthSummaryTable",
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
  setup(): {
    data: Ref<MonthSummary[]> | Ref<undefined>,
    isError: Ref<boolean>,
    refetch: (options?: RefetchOptions | undefined) => Promise<QueryObserverResult<MonthSummary[], Error>>,
    isFetching: Ref<boolean>,
    isLoading: Ref<boolean>,
    error: Ref<Error> | Ref<null>,
    columns: { prop: string; label: string }[],
    selectedMonth: ComputedRef<string>,
    goToPreviousMonth: (selectedMonth: string, months: MonthYear[]) => string,
    goToNextMonth: (selectedMonth: string, months: MonthYear[]) => string,
    isFirstMonth: ComputedRef<boolean>,
    isLastMonth: ComputedRef<boolean>,
    resetSelectedMonth: () => void,
    Close: typeof Close
  } {
    const store = useTransactionsStore()
    const selectedMonth = computed(() => store.getSelectedMonth)
    const months = computed(() => store.getMonths)
    const {data, isError, refetch, isFetching, isLoading, error} = useMonthSummary()

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

    const monthSummaryTableData = computed(() => {
      if (!data.value) {
        return [];
      }
      return data.value.map((item: MonthSummary) => ({
        memo: item.memo,
        monthly_amount_debit: item.monthly_amount_debit,
      }));
    });

    const resetSelectedMonth = () => {
      store.setSelectedMonth('');
    }

    watch(() => selectedMonth.value, async (newValue: string) => {
      await refetch();
      await store.fetchPrevSummaries();
    });

    // TODO figure out why I did this in the first place
    onMounted(async () => {
      await store.fetchMonthsData()
      await store.fetchPrevSummaries();
    });

    onBeforeUnmount(() => {
      //   reset the transactionsPageLimit to the default value
      console.log('resetting the transactionsPageLimit to the default value while unmounting the component')
      store.updateTransactionsTableLimit(100)
    });

    return {
      data,
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
      isLastMonth,
      resetSelectedMonth,
      Close
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