<template>
  <h2>
    <el-icon style="vertical-align: middle">
      <TrendCharts/>
    </el-icon>
    Budget Visualizer
  </h2>

  <el-row :gutter="20">
    <!--  TODO Fix misleading name of this component, it's a barchart, not a line -->
    <el-col :span="20">
      <TimelineChart v-if="debitsByMonth" :data="debitsByMonth"/>
      <LineChart v-if="debitsByDay" :debitsByDay="debitsByDay"/>
    </el-col>
  </el-row>
  <el-alert v-if="error" type="error" :title="'Error: ' + error">
    <h2>
      {{ error }}
    </h2>
  </el-alert>
  <br/>

  <TransactionsTable
      :displayData="displayData.data"
      :uniqueMemoObject="uniqueMemoObject"
      :uniqueMonthsObject="uniqueMonthsObject"
      :selectedMemo="selectedMemo"
      :selectedMonth="selectedMonth"
      @update:selectedMemo="selectedMemo = $event"
      @update:selectedMonth="selectedMonth = $event"
  />

</template>

<script lang="ts">
import {computed, defineComponent, reactive, ref, watch, watchEffect} from "vue";
import ToDoList from "./ToDoList.vue";
import TransactionsTable from "./transactions/TransactionsTable.vue";
import {useQuery} from "@tanstack/vue-query";
import {Transaction} from "../types";
import PieChart from "./charts/PieChart.vue";
import TimelineChart from "./charts/TimelineChart.vue";
import LineChart from "./charts/LineChart.vue";
import {fetchTransactionsS3Client} from "../api";

const toDoList = [
  {text: "When there's a selected month, Display a BarChart of the budget", done: false},
  {text: "When there's a selected month, display a PieChart", done: false},
  {text: "Display a LineChart of the budget", done: false},
  {text: 'Toggle between monthly, yearly, and all time', done: false},
  {text: 'A select for filter by year', done: false},
  {text: 'Load the csv from AWS S3', done: true},
  {text: 'Display the csv as a table', done: true},
  {text: 'Paginate the table by month', done: true},
  {text: 'Select filters can be reset', done: true},
  {text: 'The Date select should filter the table showing only those transactions', done: true},
  {text: 'The Memo select should be filtered by a selectedMonth, if there is a selectedMonth', done: true},
]

const BudgetVisualizer = defineComponent({
  name: "BudgetVisualizer",
  components: {
    ToDoList,
    TransactionsTable,
    TimelineChart,
    PieChart,
    LineChart,
  },
  // TODO: add to the toDoList structure subtasks for each of the items
  setup() {
    const headers = ref([]);
    const displayData = reactive({data: ref<Transaction[]>([])});
    const selectedMonth = ref('')
    const selectedMemo = ref('')


    const {data, error, isLoading, isFetching} = useQuery(
        ['transactions'],
        fetchTransactionsS3Client
    )

    const uniqueMonthsArray = computed(() => {
      return new Set(
          displayData.data.map((d: Transaction) => d.Date.split('/')[0] + '/' + d.Date.split('/')[2])
      );
    });

    const numberOfMonths = computed(() => {
      return uniqueMonthsArray.value.size;
    });

    // Memos corresponds to Vendors, Retailers, etc.
    const numberOfUniqueMemos = computed(() => {
      return uniqueMemoArray.value.length;
    });

    const uniqueMonthsObject = computed(() => {
      return Array.from(uniqueMonthsArray.value).map((month: string) => {
        return {
          value: month,
          label: month
        };
      });
    });

    // the Memos are filtered by the selectedMonth if there is one
    const filteredMemos = computed(() => {
      if (selectedMonth.value && displayData.data) {
        return displayData.data.filter((d: Transaction) =>
            `${d.Date.split('/')[0]}/${d.Date.split('/')[2]}` === selectedMonth.value
        );
      } else {
        return displayData.data;
      }
    });

    // the options for the Memo select are unique and filtered by the selectedMonth if there is one
    const uniqueMemoArray = computed(() => {
      let filteredData = displayData.data;

      if (selectedMonth.value) {
        filteredData = filteredData.filter((d: Transaction) =>
            `${d.Date.split('/')[0]}/${d.Date.split('/')[2]}` === selectedMonth.value
        );
      }
      // remove blank and undefined values
      return [...new Set(filteredData.map((d: Transaction) => d.Memo))].filter((memo) => memo);
    });

    // builds the options of the Memo select
    const uniqueMemoObject = computed(() => {
      return [...new Set(filteredMemos.value.map((d: Transaction) => d.Memo))]
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
      if (selectedMonth.value && selectedMemo.value) {
        filteredData = filteredData.filter((d: Transaction) =>
            `${d.Date.split('/')[0]}/${d.Date.split('/')[2]}` === selectedMonth.value && d.Memo === selectedMemo.value
        );
      } else if (selectedMonth.value) {
        filteredData = filteredData.filter((d: Transaction) =>
            `${d.Date.split('/')[0]}/${d.Date.split('/')[2]}` === selectedMonth.value
        );
      } else if (selectedMemo.value) {
        filteredData = filteredData.filter((d: Transaction) => d.Memo === selectedMemo.value);
      }
      return filteredData;
    });

    function sumDebitsByMonth(data: Transaction[]): Record<string, number> {
      return data.reduce((acc: Record<string, number>, cur) => {
        const [month, day, year] = cur.Date.split('/');
        const paddedMonth = month.length === 1 ? `0${month}` : month;
        const key = `${paddedMonth}/${year}`;
        const amount = parseFloat(cur['Amount Debit']) || 0;
        acc[key] = (acc[key] || 0) + amount;
        return acc;
      }, {});
    }

    const debitsByMonth = computed(() => {
      const data = filterData.value;
      const debitsObj = sumDebitsByMonth(data);
      return Object.keys(debitsObj).map((date) => ({date, amount: debitsObj[date]}));
    });

    function sumDebitsByDay(data: Transaction[]): Record<string, number> {
      return data.reduce((acc: Record<string, number>, cur) => {
        const date = cur.Date;
        const amount = parseFloat(cur['Amount Debit']) || 0;
        acc[date] = (acc[date] || 0) + amount;
        return acc;
      }, {});
    }

    const debitsByDay = computed(() => {
      const data = filterData.value;
      const debitsObj = sumDebitsByDay(data);
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
      // Map the memoGroups object to an array of objects with date and memos keys
      return Object.keys(memoGroups).map((date) => ({
        date,
        memos: memoGroups[date],
      }));
    });

    watchEffect(() => {
      displayData.data = filterData.value;

      console.log('memosByDate', memosByDate.value);
    });

    watch(() => [selectedMonth.value, selectedMemo.value], (newValue, oldValue) => {
      console.log('Selected month changed from', oldValue, 'to', newValue);
    });

    return {
      debitsByMonth,
      debitsByDay,
      displayData,
      error,
      filterData,
      headers,
      isLoading,
      isFetching,
      numberOfMonths,
      memosByDate,
      selectedMonth,
      selectedMemo,
      toDoList,
      uniqueMonthsArray,
      uniqueMemoArray,
      uniqueMonthsObject,
      uniqueMemoObject,
    };
  },
});
export default BudgetVisualizer;
</script>

<style scoped>
</style>