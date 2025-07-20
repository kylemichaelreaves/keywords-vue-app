<template>
  <el-card class="dark">
    <template #header>
      <div class="card-header">
        <h1>
          <el-icon style="vertical-align: middle">
            <TrendCharts/>
          </el-icon>
          Budget Visualizer
        </h1>
        <el-button type="primary" @click="showTransactionForm = true">Add New Transaction</el-button>
        <el-dialog v-model="showTransactionForm" title="Add New Transaction">
          <TransactionCreateForm @close="showTransactionForm = false"/>
        </el-dialog>
      </div>
    </template>
    <el-container>
      <el-aside width="100px">
        <el-menu class="el-menu-vertical-demo" :default-active="route.path" :collapse="true" router>
          <router-link v-for="item in menuItems" :key="item.index" :to="{name: item.name}">
            <el-menu-item :index="item.name" :route="item.name">
              <el-icon>
                <component :is="item.icon"/>
              </el-icon>
              <template #title><span>{{ item.title }}</span></template>
            </el-menu-item>
          </router-link>
        </el-menu>
      </el-aside>
      <el-main class="main-container">
        <router-view :key="route.fullPath"></router-view>
      </el-main>
    </el-container>
  </el-card>
  <VueQueryDevtools/>
</template>

<script setup lang="ts">
import {ref} from "vue";
import {TrendCharts} from "@element-plus/icons-vue";
import {VueQueryDevtools} from '@tanstack/vue-query-devtools'
import {ElDialog} from "element-plus";
import {useRoute} from "vue-router";
import TransactionCreateForm from "@components/transactions/TransactionCreateForm.vue";

const showTransactionForm = ref(false);

const route = useRoute();

const menuItems = [
  {index: "1", name: "transactions", icon: "Money", title: "Transactions"},
  {index: "2", name: "memos", icon: "OfficeBuilding", title: "Memos"},
  {index: "3", name: "budget-categories", icon: "Files", title: "Budget Categories"},
  {index: "4", name: "loan-calculator", icon: "Calendar", title: "Loan Calculator"},
  {index: "5", name: "chart-sandbox", icon: "TrendCharts", title: "Chart Sandbox"},
]

</script>

<style scoped>
.dark {
  background-color: #383838;
  color: #ecf0f1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.main-container {
  padding: 0;
}
</style>
