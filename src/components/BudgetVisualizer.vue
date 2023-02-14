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

  <!--  do I really need the v-if=data ??? -->
  <TransactionsTable
      v-if="data" :data="[data]"
      :displayData="displayData.data"
      :uniqueMemoObject="uniqueMemoObject"
      :uniqueMonthsObject="uniqueMonthsObject"
      :selectedMemo="selectedMemo"
      :selectedMonth="selectedMonth"
      :columns="columns"
  />
</template>

<script lang="ts">
import {computed, defineComponent, reactive, ref, watch, watchEffect} from "vue";
import ToDoList from "./ToDoList.vue";
import TransactionsTable from "./TransactionsTable.vue";
import {useQuery} from "@tanstack/vue-query";
import {GetObjectCommand, S3Client} from "@aws-sdk/client-s3";
import * as d3 from 'd3';

type Transaction = {
  "Transaction Number"?: string;
  Date: string;
  Description: string;
  Memo: string;
  "Amount Debit": string;
  "Amount Credit"?: string;
  Balance?: string;
  "Check Number"?: string;
  Fees?: string;
};

type TransactionsList = { data: Array<Transaction> };


const BudgetVisualizer = defineComponent({
  name: "BudgetVisualizer",
  components: {
    ToDoList,
    TransactionsTable
  },
  // TODO: add to the toDoList structure subtasks for each of the items
  setup() {
    const headers = ref([]);
    let displayData: TransactionsList = reactive({data: []});
    const selectedMonth = ref('')
    const selectedMemo = ref('')

    const toDoList = [
      {text: 'Load the csv from AWS S3', done: true},
      {text: 'Display the csv as a table', done: true},
      {text: 'Paginate the table by month', done: false},
      {text: 'Display a piechart of the budget', done: false},
      {text: 'Display a bar chart of the budget', done: false},
      {text: 'Display a line chart of the budget', done: false},
      {text: 'Toggle between monthly, yearly, and all time', done: false},
    ]


    async function fetchTransactionsS3Client(): Promise<Transaction[]> {
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
          return d3.dsvFormat(';').parse(csvString).map(row => ({
            Date: row.Date ?? '',
            Description: row.Description ?? '',
            Memo: row.Memo ?? '',
            'Amount Debit': row['Amount Debit'] ?? ''
          }));
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
      selectedMonth.value = value
    }

    const handleMemoChange = (value: string) => {
      selectedMemo.value = value
    }

    const {data, error, isLoading, isFetching} = useQuery({
      queryKey: ['transactions'],
      queryFn: fetchTransactionsS3Client
    })

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

    const uniqueMemoArray = computed(() => {
      // remove blank and undefined values
      return [...new Set(displayData.data.map((d) => d.Memo))].filter((memo) => memo);
    });

    const uniqueMemoObject = computed(() => {
      return uniqueMemoArray.value.map((memo) => {
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

    watch(
        selectedMonth,
        (newMonth) => {
          if (newMonth) {
            displayData.data = displayData.data.filter(
                (d: Transaction) => `${d.Date.split('/')[0]}/${d.Date.split('/')[2]}` === newMonth
            )
          }
        }
    )

    watch(
        selectedMemo,
        (newMemo) => {
          if (newMemo) {
            displayData.data = displayData.data.filter(
                (d: Transaction) => d.Memo === newMemo
            )
          }
        }
    )


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
});
export default BudgetVisualizer;
</script>

<style scoped>
</style>