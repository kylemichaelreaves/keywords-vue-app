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
      v-if="data" :data="[data]"
      :displayData="displayData"
      :uniqueMemoObject="uniqueMemoObject"
      :uniqueMonthsObject="uniqueMonthsObject"
      :selectedMemo="selectedMemo"
      :selectedMonth="selectedMonth"
      :columns="columns"
  />
</template>

<script lang="ts">
import {defineComponent, reactive, ref, watchEffect} from "vue";
import ToDoList from "./ToDoList.vue";
import TransactionsTable from "./TransactionsTable.vue";
import {useQuery} from "@tanstack/vue-query";
import Papa from 'papaparse';
import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";

type Transaction = {
  "Transaction Number": string;
  Date: string;
  Description: string;
  Memo: string;
  "Amount Debit": string;
  "Amount Credit": string;
  Balance: string;
  "Check Number": string;
  Fees: string;
};


const BudgetVisualizer = defineComponent({
  name: "BudgetVisualizer",
  components: {
    ToDoList,
    TransactionsTable
  },
  // TODO: add to the toDoList structure subtasks for each of the items
  setup() {
    let headers: Array<string> = reactive([]);
    let displayData: Array<Transaction> = reactive([]);
    const uniqueMonthsArray: Set<string> = reactive(new Set());
    const numberOfMonths = ref(0)
    const uniqueMonthsObject: Array<{ value: string, label: string }> = reactive([]);

    const selectedMonth = ref('')
    const selectedMemo = ref('')
    const uniqueMemoArray: Array<string> = reactive([]);
    const uniqueMemoObject: Array<{ value: string, label: string }> = reactive([]);

    const toDoList = [
      {text: 'Load the csv from AWS S3', done: true},
      {text: 'Display the csv as a table', done: true},
      {text: 'Paginate the table by month', done: false},
      {text: 'Display a piechart of the budget', done: false},
      {text: 'Display a bar chart of the budget', done: false},
      {text: 'Display a line chart of the budget', done: false},
      {text: 'Toggle between monthly, yearly, and all time', done: false},
    ]

    const fetchTransactionsS3Client = async () => {
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
          return Papa.parse(csvString, {headers: true});
          // return await data.Body.transformToString()
        } else {
          console.log('Data body is undefined');
          return;
        }
      } catch (error) {
        console.log(error)
      }
    }

    // handleMonthChange sets the monthSelected state to the value of the selected month
    const handleMonthChange = (value: string) => {
      selectedMonth.value = value
    }

    const handleMemoChange = (value: string) => {
      selectedMemo.value = value
    }


    const {data, error, isLoading, isFetching} = useQuery({
      queryKey: ['transactions'],
      queryFn: fetchTransactionsS3Client
    })

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
      console.log(`uniqueMonthsArray: ${(uniqueMonthsArray)}`)
      console.log(`type of uniqueMonthsArray: ${typeof uniqueMonthsArray}`)
      console.log(`uniqueMemoArray: ${(uniqueMemoArray)}`)
    })

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
      uniqueMemoObject
    };
  },
  watch: {
    data: {
      immediate: true,
      handler(data) {
        if (data?.data) {
          this.headers = data.data[0];

          this.displayData = data.data.slice(1).map((row: Array<string>) => {
            return this.headers.reduce((object: { [key: string]: string }, header: string, index: number) => {
              object[header] = row[index];
              return object;
            }, {});
          })

          this.uniqueMonthsArray = new Set(this.displayData.map(
              (d: Transaction) => d.Date.split("/")[0] + "/" + d.Date.split("/")[2]));

          this.uniqueMonthsObject = Array.from(this.uniqueMonthsArray).map((month: string) => {
            return {
              value: month,
              label: month,
            }
          });

          this.numberOfMonths = this.uniqueMonthsArray.size;

          this.uniqueMemoArray = [...new Set(this.displayData.map(d => d.Memo))];

          this.uniqueMemoObject = this.uniqueMemoArray.map(memo => ({
            value: memo,
            label: memo
          }));
        }
      },
    },
    selectedMonth: {
      immediate: true,
      handler(selectedMonth) {
        if (selectedMonth) {
          console.log(`selectedMonth: ${selectedMonth}`)
          this.displayData = this.displayData.filter(
              (d: Transaction) => d.Date.split("/")[0] + "/" + d.Date.split("/")[2] === selectedMonth
          )
        }
      }
    }
  },
});
export default BudgetVisualizer;
</script>

<style scoped>
</style>