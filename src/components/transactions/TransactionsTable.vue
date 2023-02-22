<template>
  <!--  TODO Add selectable links for Memos and Dates columns-->
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


  <el-table v-if="displayData" :data="displayData" style="width: 100%" table-layout="auto" height="auto" border>
    <el-table-column v-for="column in tableColumns" :key="column.title" :prop="column.key" :label="column.title">
      <!-- If the columns name is Date or Memo, render a link to the page    -->
      <template #default="{row}">
        <div v-if="column.key === 'Date' || column.key === 'Memo'">
          <router-link :to="{name: 'Transaction', params: {id: row.id}}">
            {{ row[column.key] }}
          </router-link>
        </div>
        <div v-else>
          {{ row[column.key] }}
        </div>
      </template>
    </el-table-column>
  </el-table>

</template>

<script lang="ts">
import {defineComponent, watchEffect, ref} from "vue";
import {useRouter} from "vue-router";
import RouterLinkColumn from "./RouterLinkColumn.vue";

const TransactionsTable = defineComponent({
  name: "TransactionsTable",
  components: {
    RouterLinkColumn
  },
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
    }
  } as const,
  setup(props) {
    const displayData = ref(props.displayData);
    const uniqueMemoObject = ref(props.uniqueMemoObject);
    const uniqueMonthsObject = props.uniqueMonthsObject;
    const selectedMemo = props.selectedMemo;
    const selectedMonth = props.selectedMonth;

    const router = useRouter();

    const tableColumns = [
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

    function formatColumn(column: string, value: string | number | Date) {
      if (column === 'Date') {
        return `<router-link :to="{ name: 'TransactionsByMonth', params: { month: formatDate('${value}') } }">${formatDate(value)}</router-link>`;
      } else if (column === 'Memo') {
        return `<router-link :to="{ name: 'TransactionsByMemo', params: { memo: '${value}' } }">${value}</router-link>`;
      } else {
        return value;
      }
    }


    function formatValue(key: string, value: string) {
      if (key === 'Date') {
        return formatDate(value);
      } else if (key === 'Memo') {
        return formatMemo(value);
      } else {
        return value;
      }
    }

    function formatDate(dateString: string | number | Date) {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'});
    }

    function formatMemo(memo: string) {
      // replace underscores with spaces and capitalize each word
      return memo.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    }


    function goToPage(page: string) {
      console.log('navigating to:', page);
      router.push(page);
    }

    watchEffect(() => {
      displayData.value = props.displayData;
    });

    watchEffect(() => {
      uniqueMemoObject.value = props.uniqueMemoObject;
    });

    return {
      displayData,
      formatValue,
      formatColumn,
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
