<template>
  <h2>
    <el-icon style="vertical-align: middle">
      <TrendCharts/>
    </el-icon>
    Budget Visualizer
  </h2>
  <!--  if there's an error, display an error -->
  <el-alert v-if="error" type="error" :title="'Error: ' + error">
    <h2>
      {{ error }}
    </h2>
  </el-alert>
  <p>This component will do many things, including:</p>
  <!-- display a list of things this component should do in a list  -->
  <ToDoList :initialTodos="toDoList"/>
  <br/>

  <TransactionsTable
      :displayData="displayData.data"
      :uniqueMemoObject="uniqueMemoObject"
      :uniqueMonthsObject="uniqueMonthsObject"
      :filteredMemoObject="filteredMemoObject"
      :selectedMemo="selectedMemo"
      :selectedMonth="selectedMonth"
      :columns="columns"
      :handle-memo-change="handleMemoChange"
      :handle-month-change="handleMonthChange"
      @update:selectedMemo="selectedMemo = $event"
      @update:selectedMonth="selectedMonth = $event"
  />

</template>

<script lang="ts">
import {computed, defineComponent, reactive, ref, watch, watchEffect} from "vue";
import ToDoList from "./ToDoList.vue";
import TransactionsTable from "./TransactionsTable.vue";
import {useQuery} from "@tanstack/vue-query";
import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import * as d3 from 'd3';
import {Transaction, TransactionsList} from "../types";


const BudgetVisualizer = defineComponent({
  name: "BudgetVisualizer",
  components: {
    ToDoList,
    TransactionsTable
  },
  // TODO: add to the toDoList structure subtasks for each of the items
  setup() {
    const headers = ref([]);
    const displayData = reactive({
      data: ref<Transaction[]>([])
    });
    const selectedMonth = ref('')
    const selectedMemo = ref('')

    const toDoList = [
      {text: 'Load the csv from AWS S3', done: true},
      {text: 'Display the csv as a table', done: true},
      {text: 'Paginate the table by month', done: true},
      {text: 'Select filters can be reset', done: false},
      {text: 'Display a piechart of the budget', done: false},
      {text: 'Display a bar chart of the budget', done: false},
      {text: 'Display a line chart of the budget', done: false},
      {text: 'Toggle between monthly, yearly, and all time', done: false},
      {text: 'The Date select should filter the table showing only those transactions', done: false},
      {text: 'The Memo select should be filtered by a selectedMonth, if there is a selectedMonth', done: false},
    ]

    function parseData(data: string): TransactionsList['data'] {
      return d3.dsvFormat(',').parse(data).map(row => ({
        Date: row.Date ?? '',
        Description: row.Description ?? '',
        Memo: row.Memo ?? '',
        'Amount Debit': row['Amount Debit'] ?? '',
        'Amount Credit': row['Amount Credit'] ?? '',
      }));
    }

    async function fetchTransactionsS3Client(): Promise<TransactionsList['data']> {
      const s3Client = new S3Client({
        region: 'us-east-1',
        credentials: {
          accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY_ID,
          secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY
        }
      });
      const bucketParams = {
        Bucket: import.meta.env.VITE_S3_BUCKET,
        Key: 'transactions.csv'
      }
      try {
        const data = await s3Client.send(new GetObjectCommand(bucketParams));
        if (data.Body) {
          const csvString = await data.Body.transformToString();
          return parseData(csvString);
        } else {
          console.log('Data body is undefined');
          return [];
        }
      } catch (error) {
        console.log(error)
        return [];
      }
    }

    // handleMonthChange sets the monthSelected state to the value of the selected month
    const handleMonthChange = (value: string) => {
      console.log(`handleMonthChange: ${value}`)
      // selectedMonth.value = value
    }

    const handleMemoChange = (value: string) => {
      console.log(`handleMemoChange: ${value}`)
      // selectedMemo.value = value
    }

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

    const filteredMemoObject = computed(() => {
      return Array.from(filteredMemos.value).map((memo) => {
        return {
          value: memo,
          label: memo
        };
      });
    });

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

    const transactionTableColumns = [
      {
        title: 'Date',
        key: 'Date',
      },
      {
        title: 'Description',
        key: 'Description',
      },
      {
        title: 'Memo',
        key: 'Memo',
      },
      {
        title: 'Amount Debit',
        key: 'Amount Debit',
      },
      {
        title: 'Amount Credit',
        key: 'Amount Credit',
      },
    ];

    watchEffect(() => {

      if (selectedMonth.value && data.value) {
        const filteredData = data.value.filter((d: Transaction) =>
            `${d.Date.split('/')[0]}/${d.Date.split('/')[2]}` === selectedMonth.value
        );
        displayData.data = filteredData;

      } else if (selectedMemo.value && data.value) {
        const filteredData = data.value.filter((d: Transaction) => d.Memo === selectedMemo.value);
        displayData.data = filteredData;


      } else if (selectedMonth.value && selectedMemo.value && data.value) {
        // TODO the selectedMemo.value should be filtered by the selectedMonth.value
        displayData.data = data.value.filter((d: Transaction) =>
            `${d.Date.split('/')[0]}/${d.Date.split('/')[2]}` === selectedMonth.value
        ).filter((d: Transaction) => d.Memo === selectedMemo.value);

      } else if (data.value) {
        displayData.data = [...data.value];
      }
    });

    watchEffect(() => {
      console.log('uniqueMemoObject length:', uniqueMemoObject.value.length);
      console.log('uniqueMemoObject:', JSON.stringify(uniqueMemoObject.value));
    });

    watch(() => selectedMonth.value, (newValue, oldValue) => {
      console.log('Selected month changed from', oldValue, 'to', newValue);
    });


    return {
      columns: transactionTableColumns,
      data,
      displayData,
      error,
      headers,
      handleMonthChange,
      handleMemoChange,
      isLoading,
      isFetching,
      numberOfMonths,
      toDoList,
      selectedMonth,
      selectedMemo,
      uniqueMonthsArray,
      uniqueMemoArray,
      uniqueMonthsObject,
      uniqueMemoObject,
      filteredMemoObject,
    };
  },
});
export default BudgetVisualizer;
</script>

<style scoped>
</style>