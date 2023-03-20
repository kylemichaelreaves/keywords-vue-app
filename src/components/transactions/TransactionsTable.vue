<template>
  <el-select
      v-if="uniqueMonthsObject && uniqueMonthsObject.length"
      v-model="selectedMonth"
      placeholder="Select a month"
      @change="$emit('update:selectedMonth', selectedMonth)"
      clearable
  >
    <el-option
        v-for="month in uniqueMonthsObject"
        :key="month.value"
        :label="month.label"
        :value="month.value"
    />
  </el-select>

  <el-select
      v-if="uniqueMemoObject && uniqueMemoObject.length"
      v-model="selectedMemo"
      placeholder="Select a unique memo"
      style="width: 300px;"
      @change="$emit('update:selectedMemo', selectedMemo)"
      clearable
      filterable
  >
    <el-option
        v-for="memo in uniqueMemoObject"
        :key="memo.value"
        :label="memo.label"
        :value="memo.value"
    />
  </el-select>


  <el-table v-loading="isFetching" v-if="displayData" :data="displayData" style="width: 100%" table-layout="auto" height="auto" border>
    <el-table-column v-for="column in tableColumns" :key="column.title" :prop="column.key" :label="column.title">
      <!-- If the columns name is Date or Memo, render a link to the page    -->
      <template #default="{row}">
        <div v-if="column.key === 'Date' || column.key === 'Memo'">
          <router-link :to="`/transaction/${row['Transaction Number']}`">{{ row[column.key] }}</router-link>
        </div>
        <div v-else>
          {{ row[column.key] }}
        </div>
      </template>
    </el-table-column>
  </el-table>

</template>

<script lang="ts">
import {defineComponent, watchEffect, ref, watch} from "vue";

const TransactionsTable = defineComponent({
  name: "TransactionsTable",
  emits: ["update:selectedMemo", "update:selectedMonth"],
  props: {
    displayData: {
      type: Array,
      default: () => []
    },
    uniqueMemoObject: {
      type: Array,
      default: () => []
    },
    uniqueMonthsObject: {
      type: Array,
      default: () => []
    },
    selectedMemo: {
      type: String,
      default: ""
    },
    selectedMonth: {
      type: String,
      default: ""
    },
    incrementOffset: {
      type: Function,
      required: true
    },
    isFetching: {
      type: Boolean,
      required: true
    }
  } as const,
  setup(props) {
    const displayData = ref(props.displayData);
    const uniqueMemoObject = ref(props.uniqueMemoObject);
    const uniqueMonthsObject = props.uniqueMonthsObject;
    const selectedMemo = props.selectedMemo;
    const selectedMonth = props.selectedMonth;
    const isFetching = ref(props.isFetching);

    const tableColumns = [
      {
        title: 'Transaction Number',
        key: 'Transaction Number',
      },
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
      displayData.value = props.displayData;
      console.log('displayData.value', displayData.value)
    });

    watchEffect(() => {
      uniqueMemoObject.value = props.uniqueMemoObject;
    });

    watch(
        () => props.isFetching,
        (newValue) => {
          isFetching.value = newValue;
        },
    );

    return {
      displayData,
      isFetching,
      uniqueMemoObject,
      uniqueMonthsObject,
      selectedMemo,
      selectedMonth,
      tableColumns
    };
  }


});

export default TransactionsTable;
</script>

<style scoped>
</style>
