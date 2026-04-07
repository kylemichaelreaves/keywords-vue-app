<template>
  <div class="bv-layout">
    <aside class="bv-sidebar" aria-label="Budget sections">
      <nav class="bv-nav" role="navigation">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          class="bv-nav-link"
          :class="{ 'bv-nav-link--active': isNavActive(item.path) }"
        >
          <el-icon class="bv-nav-icon" :size="20">
            <component :is="item.icon" />
          </el-icon>
          <span class="bv-nav-label">{{ item.title }}</span>
        </router-link>
      </nav>
    </aside>

    <div class="bv-column">
      <header class="bv-topbar">
        <div class="bv-topbar-top">
          <div>
            <h2 class="bv-page-title">{{ pageTitle }}</h2>
            <p v-if="pageSubtitle" class="bv-page-subtitle">{{ pageSubtitle }}</p>
          </div>
          <el-button type="primary" class="bv-cta" @click="showTransactionForm = true">
            Add New Transaction
          </el-button>
        </div>
        <div class="bv-topbar-sub">
          <Breadcrumbs />
        </div>
      </header>

      <main class="bv-main">
        <router-view :key="route.fullPath" />
      </main>
    </div>

    <el-dialog v-model="showTransactionForm" title="Add New Transaction" width="min(520px, 94vw)">
      <TransactionCreateForm @close="showTransactionForm = false" />
    </el-dialog>
    <VueQueryDevtools />
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { VueQueryDevtools } from '@tanstack/vue-query-devtools'
import { Money, OfficeBuilding, Files, Calendar } from '@element-plus/icons-vue'
import { useRoute } from 'vue-router'
import TransactionCreateForm from '@components/transactions/TransactionCreateForm.vue'
import Breadcrumbs from '@components/Breadcrumbs.vue'

const showTransactionForm = ref(false)
const route = useRoute()

const ROUTE_META: Record<string, { title: string; subtitle?: string }> = {
  'budget-visualizer': { title: 'Overview' },
  transactions: { title: 'Transactions', subtitle: 'Manage your income and expenses' },
  'pending-transactions': { title: 'Pending transactions' },
  'transaction-edit': { title: 'Edit transaction' },
  'pending-transaction-edit': { title: 'Edit pending transaction' },
  'month-summary': { title: 'Month summary' },
  'week-summary': { title: 'Week summary' },
  memos: { title: 'Memos' },
  'memo-summary': { title: 'Memo summary' },
  'memo-edit': { title: 'Edit memo' },
  'budget-categories': {
    title: 'Budget categories',
    subtitle: 'Set spending limits and manage your category hierarchy',
  },
  'loan-calculator': { title: 'Loan calculator' },
}

const pageTitle = computed(() => {
  const n = route.name != null ? String(route.name) : ''
  return ROUTE_META[n]?.title ?? 'Budget Visualizer'
})

const pageSubtitle = computed(() => {
  const n = route.name != null ? String(route.name) : ''
  return ROUTE_META[n]?.subtitle ?? ''
})

const menuItems = [
  {
    path: '/budget-visualizer/transactions',
    icon: Money,
    title: 'Transactions',
  },
  {
    path: '/budget-visualizer/memos',
    icon: OfficeBuilding,
    title: 'Memos',
  },
  {
    path: '/budget-visualizer/budget-categories',
    icon: Files,
    title: 'Budget categories',
  },
  {
    path: '/budget-visualizer/loan-calculator',
    icon: Calendar,
    title: 'Loan calculator',
  },
]

function isNavActive(path: string) {
  return route.path === path || route.path.startsWith(`${path}/`)
}
</script>

<style scoped>
.bv-layout {
  display: flex;
  min-height: calc(100vh - 4rem);
  width: 100%;
  max-width: 100%;
  background: var(--bv-main-bg);
  color: var(--app-text-color);
}

.bv-sidebar {
  width: 192px;
  flex-shrink: 0;
  background: var(--bv-sidebar-bg);
  color: var(--bv-sidebar-text);
  padding: 1rem 0;
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--bv-border);
}

.bv-nav {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.bv-nav-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem 0.75rem;
  margin: 0 0.5rem;
  border-radius: var(--bv-radius);
  color: var(--bv-sidebar-text);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  transition:
    background-color 0.15s ease,
    color 0.15s ease;
}

.bv-nav-link:hover {
  background: var(--bv-sidebar-hover-bg);
  color: var(--bv-sidebar-text);
}

.bv-nav-link--active {
  background: var(--bv-sidebar-active-bg);
  color: var(--bv-sidebar-active-text);
}

.bv-nav-icon {
  flex-shrink: 0;
}

.bv-column {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.bv-topbar {
  background: var(--bv-topbar-bg);
  border-bottom: 1px solid var(--bv-border);
  padding: 1rem 1.5rem 0.75rem;
}

.bv-topbar-top {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.bv-page-title {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 500;
  line-height: 1.5;
  color: var(--app-text-color);
}

.bv-page-subtitle {
  margin: 0.25rem 0 0;
  font-size: 0.875rem;
  color: var(--bv-sidebar-muted);
  line-height: 1.5;
}

.bv-cta {
  --el-button-bg-color: var(--bv-primary);
  --el-button-border-color: var(--bv-primary);
  --el-button-text-color: var(--bv-primary-fg);
  --el-button-hover-bg-color: var(--bv-primary-hover);
  --el-button-hover-border-color: var(--bv-primary-hover);
  font-weight: 500;
}

.bv-topbar-sub {
  margin-top: 0.5rem;
}

.bv-topbar-sub :deep(.el-breadcrumb__inner),
.bv-topbar-sub :deep(.el-breadcrumb__separator) {
  color: var(--bv-sidebar-muted);
}

.bv-topbar-sub :deep(.el-breadcrumb__inner a) {
  color: var(--app-text-color);
  font-weight: 500;
}

.bv-topbar-sub :deep(.el-breadcrumb__inner a:hover) {
  color: var(--bv-primary);
}

.bv-main {
  flex: 1;
  padding: 1.5rem;
  overflow: auto;
}
</style>
