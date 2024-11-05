<template>
  <AlertComponent v-if="isError && error" :title="error.name" :message="error.message" type="error"/>
  <el-pagination
      data-testid="transactions-table-pagination"
      background
      layout="prev, pager, next"
      :total="transactionsCount"
      :page-size="limit"
      :current-page="currentPage"
      @current-change="handleCurrentChange"
      @size-change="handleSizeChange"
  />
</template>

<script setup lang="ts">
import useTransactionsCount from "@api/hooks/transactions/useTransactionsCount";
import {computed} from "vue";
import AlertComponent from "@components/shared/AlertComponent.vue";
import {useTransactionsStore} from "@stores/transactions";

const {isError, error} = useTransactionsCount();

const store = useTransactionsStore();

const transactionsCount = computed(() => store.getTransactionsCount);

const currentPage = computed({
  get: () => Math.floor(store.transactionsTableOffset / store.transactionsTableLimit) + 1,
  set: (val: number) => {
    store.updateTransactionsTableOffset((val - 1) * store.transactionsTableLimit);
  },
});

const limit = computed({
  get: () => store.transactionsTableLimit,
  set: (val: number) => {
    store.setTransactionsTableLimit(val);
    store.updateTransactionsTableOffset(0);
  },
});

function handleCurrentChange(newPage: number) {
  currentPage.value = newPage;
}

function handleSizeChange(newSize: number) {
  limit.value = newSize;
  currentPage.value = 1;
}


</script>

<style scoped>

</style>