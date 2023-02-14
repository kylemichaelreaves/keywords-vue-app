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
          const transactionsList = d3.dsvFormat(';').parse(csvString).map(row => ({
            Date: row.Date ?? '',
            Description: row.Description ?? '',
            Memo: row.Memo ?? '',
            'Amount Debit': row['Amount Debit'] ?? ''
          }));
          return transactionsList;
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

    // watchEffect(() => {
    //   if (data.value?.data) {
    //     // TS2740: Type 'TransactionsList' is missing the following properties from type 'never[]': length, pop, push, concat, and 29 more.
    //     headers.value = data.value.data[0];
    //     displayData.data = data.value.data
    //         .slice(1)
    //         // TS2345: Argument of type '(row: Array<string>) => Transaction' is not assignable to parameter of type '(value: TransactionsList, index: number, array: TransactionsList[]) => Transaction'.   Types of parameters 'row' and 'value' are incompatible.     Type 'TransactionsList' is missing the following properties from type 'string[]': length, pop, push, concat, and 29 more.
    //         .map((row: Array<string>) => {
    //           return headers.value.reduce(
    //               (object: { [key: string]: string }, header: string, index: number) => {
    //                 object[header] = row[index];
    //                 return object;
    //               },
    //               {} as { [key: string]: string }
    //           ) as Transaction;
    //         });
    //     uniqueMonthsArray = new Set(
    //
    //         displayData.data.map((d: Transaction) => d.Date.split("/")[0] + "/" + d.Date.split("/")[2])
    //     );
    //     // TS2322: Type '{ value: string; label: string; }[]' is not assignable to type '() => IterableIterator<{ value: string; label: string; }>'.   Type '{ value: string; label: string; }[]' provides no match for the signature '(): IterableIterator<{ value: string; label: string; }>'.
    //     uniqueMonthsObject.values = Array.from(uniqueMonthsArray).map((month: string) => {
    //       return {
    //         value: month,
    //         label: month,
    //       };
    //     });
    //     numberOfMonths.value = uniqueMonthsArray.size;
    //     uniqueMemoArray = [...new Set(displayData.data.map((d) => d.Memo))];
    //     // TS2322: Type '{ value: string; label: string; }[]' is not assignable to type '() => IterableIterator<{ value: string; label: string; }>'.   Type '{ value: string; label: string; }[]' provides no match for the signature '(): IterableIterator<{ value: string; label: string; }>
    //     uniqueMemoObject.values = uniqueMemoArray.map((memo) => ({
    //       value: memo,
    //       label: memo,
    //     }));
    //   }
    // });


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
  // watch: {
  //   data: {
  //     immediate: true,
  //     handler(data) {
  //       if (data?.data) {
  //         this.headers = data.data[0];
  //
  //         this.displayData = data.data.slice(1).map((row: Array<string>) => {
  //           return this.headers.reduce((object: { [key: string]: string }, header: string, index: number) => {
  //             object[header] = row[index];
  //             return object;
  //           }, {});
  //         })
  //
  //         this.uniqueMonthsArray = new Set(this.displayData.data.map(
  //             (d: Transaction) => d.Date.split("/")[0] + "/" + d.Date.split("/")[2]));
  //
  //         this.uniqueMonthsObject = Array.from(this.uniqueMonthsArray).map((month: string) => {
  //           return {
  //             value: month,
  //             label: month,
  //           }
  //         });
  //
  //         this.numberOfMonths = this.uniqueMonthsArray.size;
  //
  //         this.uniqueMemoArray = [...new Set(this.displayData.data.map(d => d.Memo))];
  //
  //         this.uniqueMemoObject = this.uniqueMemoArray.map(memo => ({
  //           value: memo,
  //           label: memo
  //         }));
  //       }
  //     },
  //   },
  //   // selectedMonth: {
  //   //   immediate: true,
  //   //   handler(selectedMonth) {
  //   //     if (selectedMonth) {
  //   //       console.log(`selectedMonth: ${selectedMonth}`)
  //   //       this.displayData.data = this.displayData.data.filter(
  //   //           (d: Transaction) => d.Date.split("/")[0] + "/" + d.Date.split("/")[2] === selectedMonth
  //   //       )
  //   //     }
  //   //   }
  //   // }
  // },
});
export default BudgetVisualizer;
</script>

<style scoped>
</style>