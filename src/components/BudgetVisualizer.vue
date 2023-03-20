<template>
  <h2>
    <el-icon style="vertical-align: middle">
      <TrendCharts/>
    </el-icon>
    Budget Visualizer
  </h2>

  <el-row :gutter="20">
    <!--    <el-col :span="17">-->
    <!--      <TimelineBarChart v-if="debitsByMonth" :data="debitsByMonth" :selectedMonth="selectedMonth"/>-->
    <!--      <LineChart v-if="debitsByDay" :debitsByDay="debitsByDay"/>-->
    <!--    </el-col>-->
    <el-col :span="4">
      <TransactionUploader/>
    </el-col>
    <!--    <el-col :span="16">-->
    <!--    <Calendar/>-->
    <!--    </el-col>-->
  </el-row>
  <el-alert v-if="error" type="error" :title="'Error: ' + error">
    <h2>
      {{ error }}
    </h2>
  </el-alert>
  <br/>

  <TransactionsTable
      :displayData="displayData.rows"
      :uniqueMemoObject="uniqueMemoObject"
      :uniqueMonthsObject="uniqueMonthsObject"
      :selectedMemo="selectedMemo"
      :selectedMonth="selectedMonth"
      @update:selectedMemo="selectedMemo = $event"
      @update:selectedMonth="selectedMonth = $event"
      :incrementOffset="incrementOffset"
      :isFetching="isFetching"
  />

</template>

<script lang="ts">
import {computed, defineComponent, reactive, ref, watchEffect} from "vue";
import ToDoList from "./ToDoList.vue";
import Calendar from "./Calendar.vue";
import TransactionsTable from "./transactions/TransactionsTable.vue";
import TransactionUploader from "./transactions/TransactionUploader.vue";
import {useQuery} from "@tanstack/vue-query";
import {Transaction} from "../types";
import PieChart from "./charts/PieChart.vue";
import TimelineBarChart from "./charts/TimelineBarChart.vue";
import LineChart from "./charts/LineChart.vue";
import {fetchTransactionsRDS} from "../api";
import {filterDataByMonth, sumDebits, filterDataByMemo} from '../dataUtils';

const BudgetVisualizer = defineComponent({
  name: "BudgetVisualizer",
  components: {
    Calendar,
    ToDoList,
    TransactionsTable,
    TransactionUploader,
    TimelineBarChart,
    PieChart,
    LineChart,
  },

  setup() {
    const headers = ref([]);
    const displayData = reactive({rows: ref<Transaction[]>([])});
    const selectedMonth = ref('')
    const selectedMemo = ref('')

    // variables for paginating query
    const LIMIT = 100;
    const OFFSET = ref(0);

    function incrementOffset() {
      OFFSET.value += LIMIT;
    }

    const {data, error, isLoading, isFetching} = useQuery(
        ['transactions', LIMIT, OFFSET],
        // fetchTransactionsS3Client
        () => fetchTransactionsRDS(LIMIT, OFFSET.value),
        {
          keepPreviousData: true,
          refetchOnWindowFocus: false,
        }
    )

    // unique dates array, not by month but by day
    // Use computed to create a new array of unique dates
    const uniqueDatesArray = computed(() => {
      return [...new Set(filterData.value.map(item => item.Date))];
    });

    const uniqueMonthsArray = computed(() => {
      return new Set(
          filteredMemoDataAndMonth.value.memoData.map((d: Transaction) =>
              d.Date.split("/")[0] + "/" + d.Date.split("/")[2]
          )
      );
    });

    // the options for the Date dropdown
    const uniqueMonthsObject = computed(() => {
      return Array.from(uniqueMonthsArray.value).map((month: string) => {
        return {
          value: month,
          label: month
        };
      });
    });

    const filteredMemoDataAndMonth = computed(() => {
      return {
        memoData: transactionsFilteredByMonthAndMemo.value,
        month: selectedMonth.value
      };
    });

    // the Memos are filtered by the selectedMonth if there is one
    const transactionsFilteredByMonth = computed(() => {
      if (selectedMonth.value && displayData.rows) {
        return displayData.rows.filter((d: Transaction) =>
            `${d.Date.split('/')[0]}/${d.Date.split('/')[2]}` === selectedMonth.value
        );
      } else {
        return displayData.rows;
      }
    });

    // create a new computed property to store the filtered data
    const transactionsFilteredByMonthAndMemo = computed(() => {
      let filteredData = data.value || [];
      if (selectedMonth.value) {
        filteredData = filteredData.filter((d: Transaction) =>
            `${d.Date.split('/')[0]}/${d.Date.split('/')[2]}` === selectedMonth.value
        );
      }
      return filteredData;
    });

// use the filteredData computed property in uniqueMemoArray
    const uniqueMemoArray = computed(() => {
      // remove blank and undefined values
      return [
        ...new Set(filteredMemoDataAndMonth.value.memoData.map((d: Transaction) => d.Memo))
      ].filter(memo => memo);
    });

    // builds the options of the Memo select
    const filteredMemoOptions = computed(() => {
      return [...new Set(transactionsFilteredByMonth.value.map((d: Transaction) => d.Memo))]
          .filter((memo) => memo)
          .map((memo) => {
            return {
              value: memo,
              label: memo
            };
          });
    });

    const filterData = computed(() => {
      let filteredData = data.value || [];
      filteredData = filterDataByMonth(filteredData, selectedMonth.value);
      filteredData = filterDataByMemo(filteredData, selectedMemo.value);
      return filteredData;
    });


    const sumDebitsByMonth = computed(() => {
      const data = transactionsFilteredByMonthAndMemo.value;
      const debitsObj = sumDebits(data, 'month');
      return Object.keys(debitsObj).map((date) => ({date, amount: debitsObj[date]}));
    });


    const sumDebitsByDay = computed(() => {
      const data = transactionsFilteredByMonthAndMemo.value;
      const debitsObj = sumDebits(data, 'day');
      return Object.keys(debitsObj).map((date) => ({date, amount: debitsObj[date]}));
    });

    /**
     * Returns an array of objects, each with a date and a list of memos for that date.
     * Each memo has an amount value that is the total of all transactions with the same memo and date.
     *
     * @returns {ComputedRef<Array<{date: string, memos: Array<{memo: string, amount: number}>}>>}
     */
    const memosByDate = computed(() => {
      // Get the data from the filterData ref
      const data = filterData.value;
      // Create an object that groups memos by date
      const memoGroups: Record<string, { memo: string, amount: number }[]> = data.reduce((acc, cur) => {
        const date = cur.Date;
        // If the date key doesn't exist in the accumulator, create it and set its value to an empty array
        if (!acc[date]) {
          acc[date] = [];
        }
        // Check that memo is not an empty string before processing
        const memo = cur.Memo;
        if (memo !== '') {
          const amount = parseFloat(cur['Amount Debit']) || 0;
          const memoIndex = acc[date].findIndex((m) => m.memo === memo);
          // If the memo does not exist in the array, add a new object with memo and amount
          if (memoIndex === -1) {
            acc[date].push({memo, amount});
          } else { // Otherwise, add the amount to the existing memo object
            acc[date][memoIndex].amount += amount;
          }
        }
        return acc;
      }, {} as Record<string, { memo: string, amount: number }[]>);
      return memoGroups;
    });

    const memosByDateSorted = computed(() => {
      const dates = Object.keys(memosByDate.value);
      dates.sort((a, b) => {
        const dateA = new Date(a);
        const dateB = new Date(b);
        return dateA.getTime() - dateB.getTime();
      });

      const memoGroups: Record<string, { memo: string, amount: number }[]> = {};
      dates.forEach((date) => {
        memoGroups[date] = memosByDate.value[date];
      });

      return memoGroups;
    });


    watchEffect(() => {
      displayData.rows = filterData.value;
    });

    watchEffect(() => {
      console.log('uniqueMonthsObject', uniqueMonthsObject.value)
    })

    return {
      sumDebitsByMonth,
      sumDebitsByDay,
      displayData,
      error,
      filterData,
      headers,
      incrementOffset,
      isLoading,
      isFetching,
      memosByDate,
      selectedMonth,
      selectedMemo,
      uniqueMonthsArray,
      uniqueMemoArray,
      uniqueMonthsObject,
      uniqueMemoObject: filteredMemoOptions,
    };
  },
});
export default BudgetVisualizer;
</script>

<style scoped>
</style>