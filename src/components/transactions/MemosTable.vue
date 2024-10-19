<template>
  <!--  TODO update TableComponent to accept router-link-column as props -->
  <!--  <TableComponent-->
  <!--      v-if="data"-->
  <!--      :table-data="data"-->
  <!--      :isLoading="isLoading"-->
  <!--      :isFetching="isFetching"-->
  <!--      :error="error"-->
  <!--      :isError="isError"-->
  <!--      :columns="memoColumns"-->
  <!--  />-->
  <el-card>
    <AlertComponent :title="error.name" :message="error.message" type="error" v-if="isError && error"/>
    <h2>Memos Table</h2>
    <el-text size="large">A table of all the distinct Memos in the database</el-text>
    <br/>
    <el-text size="default">Along with the total Amount Debit and Budget Category, if there is one assigned to it
    </el-text>

    <el-table v-if="data" :data="data" table-layout="auto" :loading="isFetching || isLoading" size="small">
      <el-table-column v-for="column in memoColumns" :key="column.prop" :prop="column.prop" :label="column.label">
        <template v-if="column.prop === 'Memo'" #default="scope">
          <router-link :to="{ name: 'memo', params: { memo: scope.row[column.prop] }}">
            {{ scope.row[column.prop] }}
          </router-link>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script setup lang="ts">
import useMemos from "@api/hooks/transactions/useMemos";
import AlertComponent from "@components/shared/AlertComponent.vue";


const {data, isLoading, isFetching, error, isError} = useMemos();

const memoColumns = [
  {prop: 'Memo', label: 'Memo'},
  {prop: 'Budget Category', label: 'Budget Category'}
]


</script>

<style scoped>
</style>