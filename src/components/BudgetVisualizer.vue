<template>
  <el-card class="dark">
    <template #header>
      <div class="card-header">
        <h2>
          <el-icon style="vertical-align: middle">
            <TrendCharts/>
          </el-icon>
          Budget Visualizer
        </h2>
        <el-button type="primary" @click="showTransactionForm = true">Add New Transaction</el-button>
        <el-dialog v-model="showTransactionForm" title="Add New Transaction">
          <TransactionForm @close="showTransactionForm = false"/>
        </el-dialog>
      </div>
    </template>
    <el-container>
      <el-aside width="auto">
        <el-menu class="el-menu-vertical-demo" default-active="1" :collapse="true">
          <el-menu-item v-for="item in menuItems" :key="item.index" :index="item.index">
            <router-link :to="{name: item.name}">
              <el-icon>
                <component :is="item.icon"/>
              </el-icon>
              <template #title><span slot="title">{{ item.title }}</span></template>
            </router-link>
          </el-menu-item>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view :key="$route.fullPath"></router-view>
      </el-main>
    </el-container>
  </el-card>
  <VueQueryDevtools/>
</template>

<script lang="ts">
import {defineComponent, ref} from "vue";
import {Calendar, Files, Money, OfficeBuilding, TrendCharts} from "@element-plus/icons-vue";
import {VueQueryDevtools} from '@tanstack/vue-query-devtools'
import TransactionForm from "@components/transactions/TransactionForm.vue";
import {ElDialog} from "element-plus";

export default defineComponent({
  name: "BudgetVisualizer",
  components: {
    Money,
    Files,
    OfficeBuilding,
    VueQueryDevtools,
    TrendCharts,
    Calendar,
    TransactionForm,
    ElDialog
  },
  setup() {

    const showTransactionForm = ref(false);

    const menuItems = [
      {index: "1", name: "transactions", icon: "Money", title: "Transactions"},
      {index: "2", name: "memos", icon: "OfficeBuilding", title: "Memos"},
      {index: "3", name: "budget-categories", icon: "Files", title: "Budget Categories"},
      {index: "4", name: "time-range", icon: "Calendar", title: "Time Range"}
    ]

    return {
      menuItems,
      showTransactionForm
    };
  },
});
</script>

<style scoped>
.dark {
  background-color: #383838;
  color: #ecf0f1;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
