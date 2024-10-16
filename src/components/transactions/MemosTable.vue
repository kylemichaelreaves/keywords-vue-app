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
  <h2>Memos Table</h2>
  <el-text size="large">A table of all the distinct Memos in the database</el-text><br/>
  <el-text size="default">Along with the total Amount Debit and Budget Category, if there is one assigned to it</el-text>
    <div v-if="isError">
      <el-alert type="error" :title="error"/>
    </div>
    <el-table v-if="data" :data="data" table-layout="auto" :loading="isFetching" size="small">
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

<script lang="ts">
import {defineComponent} from 'vue'
import TableComponent from "@components/shared/TableComponent.vue";
import useMemos from "@api/hooks/transactions/useMemos";

export default defineComponent({
  name: 'MemosTable',
  components: {
    TableComponent,
  },
  setup() {


    const {data, isLoading, isFetching, error, isError} = useMemos();

    const memoColumns = [
      {prop: 'Memo', label: 'Memo'},
      {prop: 'Budget Category', label: 'Budget Category'}
    ]

    return {
      data,
      isLoading,
      isFetching,
      error,
      isError,
      memoColumns
    }
  }
})

</script>
<style scoped>

</style>