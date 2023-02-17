<template>
  <!--  create the el-select that will filter the table-->
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
        :value="month.value">
    </el-option>
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
        :value="memo.value">
    </el-option>
  </el-select>

  <el-table v-if="displayData" :data="displayData" style="width: 100%" table-layout="auto" height="auto">
    <el-table-column v-for="column in columns" :prop="column.title" :label="column.key"/>
  </el-table>

</template>

<script lang="ts">
import {defineComponent, watchEffect, watch, ref} from "vue";

const TransactionsTable = defineComponent({
      name: "TransactionsTable.vue",
      emits: ['update:selectedMemo', 'update:selectedMonth'],
      props: {
        displayData: {
          type: Array,
          default: () => []
        },
        uniqueMemoObject: {
          type: Array,
          default: () => []
        },
        filteredMemoObject: {
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
        const displayData = ref(props.displayData);
        const uniqueMemoObject = ref(props.uniqueMemoObject);
        const uniqueMonthsObject = props.uniqueMonthsObject;
        const filteredMemoObject = props.filteredMemoObject;
        const handleMonthChange = props.handleMonthChange;
        const handleMemoChange = props.handleMemoChange;
        const selectedMemo = props.selectedMemo;
        const selectedMonth = props.selectedMonth;

        watchEffect(() => {
          displayData.value = props.displayData;
        })

        watchEffect(() => {
          uniqueMemoObject.value = props.uniqueMemoObject;
        });

        watch(() => props.selectedMonth, (newValue, oldValue) => {
          console.log('Selected month changed from', oldValue, 'to', newValue);
        });

        watch(() => props.selectedMemo, (newValue, oldValue) => {
          console.log('Selected memo changed from', oldValue, 'to', newValue);
        });

        watch(() => props.displayData, (newValue, oldValue) => {
          console.log('length of displayData changed from', oldValue.length, 'to', newValue.length);
        });

        watch(() => props.uniqueMemoObject, (newValue, oldValue) => {
          console.log('length of uniqueMemoObject changed from', oldValue.length, 'to', newValue.length);
        });

        watch(() => props.filteredMemoObject, (newValue, oldValue) => {
          console.log('length of uniqueMonthsObject changed from', oldValue.length, 'to', newValue.length);
        });

        return {
          // data,
          displayData,
          uniqueMemoObject,
          uniqueMonthsObject,
          handleMonthChange,
          handleMemoChange,
          selectedMemo,
          selectedMonth,
          filteredMemoObject
        };
      }
    },
);

export default TransactionsTable;
</script>

<style scoped>
</style>