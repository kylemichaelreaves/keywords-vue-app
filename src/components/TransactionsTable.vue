<template>
  <!--  create the el-select that will filter the table-->
  <el-select v-model="selectedMonth" placeholder="Select a month" @change="handleMonthChange">
    <el-option
        v-if="uniqueMonthsObject"
        v-for="month in uniqueMonthsObject"
        :key="month.value"
        :label="month.label"
        :value="month.value">
    </el-option>
  </el-select>

  <el-select v-model="selectedMemo" placeholder="Select a unique memo" @change="handleMemoChange">
    <el-option
        v-if="uniqueMemoObject"
        v-for="memo in uniqueMemoObject"
        :key="memo.value"
        :label="memo.label"
        :value="memo.value">
    </el-option>
  </el-select>

  <el-table v-if="data" :data="displayData" style="width: 100%" table-layout="auto" height="450">
    <el-table-column v-for="column in columns" :prop="column.title" :label="column.key"/>
  </el-table>

</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";

const TransactionsTable = defineComponent({
      name: "TransactionsTable.vue",
      props: {
        data: {
          type: Array,
          default: () => []
        },
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
        columns: {
          type: Array,
          default: () => []
        },
        handleMonthChange: {
          type: Function,
          default: () => {
          }
        },
        handleMemoChange: {
          type: Function,
          default: () => {
          }
        },
      } as const,
      setup(props) {
        // declare the reactive variables from their props
        const data = props.data;
        const displayData = props.displayData;
        const uniqueMemoObject = props.uniqueMemoObject;
        const uniqueMonthsObject = props.uniqueMonthsObject;
        const handleMonthChange = props.handleMonthChange;
        const handleMemoChange = props.handleMemoChange;
        const selectedMemo = props.selectedMemo;
        const selectedMonth = props.selectedMonth;

        return {
          data,
          displayData,
          uniqueMemoObject,
          uniqueMonthsObject,
          handleMonthChange,
          handleMemoChange,
          selectedMemo,
          selectedMonth
        };
      }
    },
);

export default TransactionsTable;
</script>

<style scoped>
</style>