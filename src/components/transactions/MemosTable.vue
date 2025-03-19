<template>
  <el-card>
    <AlertComponent :title="error.name" :message="error.message" type="error" v-if="isError && error"/>
    <h2>Memos Table</h2>
    <el-text size="large">A table of all the distinct Memos in the database</el-text>
    <br/>
    <el-text size="default">Along with the total Amount Debit and Budget Category, if there is one assigned to it
    </el-text>
    <el-table
        v-if="flattenedData"
        :data="flattenedData"
        table-layout="auto"
        :loading="isFetching || isLoading"
        size="large"
        :default-sort="{ prop: 'total_amount_debit', order: 'descending' }"
    >
      <el-table-column
          v-for="column in memoColumns"
          :key="column.prop"
          :prop="column.prop"
          :label="column.label"
          :sortable="column.sortable"
      >
        <template v-if="column.prop === 'name'" #default="scope">
          <router-link :to="{ name: 'memo', params: { memoName: scope.row[column.prop] } }">
            {{ scope.row[column.prop] }}
          </router-link>
        </template>
        <!-- TODO assign a BudgetCategory to a Memo with a Button        -->
      </el-table-column>
    </el-table>
    <MemosTablePagination />
  </el-card>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import useMemos from "@api/hooks/transactions/useMemos";
import AlertComponent from "@components/shared/AlertComponent.vue";
import MemosTablePagination from '@components/transactions/MemosTablePagination.vue'

const {data, isLoading, isFetching, error, isError} = useMemos();

const flattenedData = computed(() => {
  return data?.value?.pages.flat() ?? [];
})

const memoColumns = [
  {prop: 'id', label: 'Id', sortable: true},
  { prop: 'name', label: 'Name', sortable: true },
  { prop: 'budget_category', label: 'Budget Category', sortable: false },
  { prop: 'total_amount_debit', label: 'Total Amount Debit', sortable: true },
  { prop: 'necessary', label: 'Necessary', sortable: false },
  { prop: 'recurring', label: 'Recurring', sortable: false },
  { prop: 'frequency', label: 'Frequency', sortable: false },
];
</script>

<style scoped>
</style>