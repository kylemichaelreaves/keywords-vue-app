import Home from '@components/Home.vue'
import NotFound from '@components/NotFound.vue'
import LoginUser from '@components/user-management/LoginUser.vue'
import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import { useTransactionsStore } from '@stores/transactions.ts'

function clearSelections(
  store: ReturnType<typeof useTransactionsStore>,
  keep?: { month?: string; week?: string; memo?: string },
) {
  store.setSelectedDay('')
  store.setSelectedWeek(keep?.week ?? '')
  store.setSelectedMonth(keep?.month ?? '')
  store.setSelectedYear('')
  store.setSelectedMemo(keep?.memo ?? '')
}

function memoBeforeEnter(to: RouteLocationNormalized) {
  clearSelections(useTransactionsStore(), { memo: to.params.memoId as string })
}

export const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/keywords',
    name: 'keywords',
    component: () => import('@components/Keywords.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/address-geocoder',
    name: 'address-geocoder',
    component: () => import('@components/address/AddressGeocoderForm.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/budget-visualizer',
    name: 'budget-visualizer',
    component: () => import('@components/BudgetVisualizer.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: { name: 'transactions' },
      },
      {
        path: 'loan-calculator',
        name: 'loan-calculator',
        component: () => import('@components/loan/LoanCalculator.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'transactions',
        name: 'transactions',
        component: () => import('@components/transactions/TransactionsTable.vue'),
        meta: { requiresAuth: true },
        children: [
          {
            path: 'months/:month/summary',
            name: 'month-summary',
            component: () =>
              import('@components/transactions/summaries/month/MonthSummaryTable.vue'),
            meta: { requiresAuth: true },
            beforeEnter: (to: RouteLocationNormalized) => {
              clearSelections(useTransactionsStore(), { month: to.params.month as string })
            },
          },
          {
            path: 'weeks/:week/summary/',
            name: 'week-summary',
            component: () => import('@components/transactions/summaries/week/WeekSummaryTable.vue'),
            meta: { requiresAuth: true },
            props: true,
            beforeEnter: (to: RouteLocationNormalized) => {
              clearSelections(useTransactionsStore(), { week: to.params.week as string })
            },
          },
        ],
      },
      {
        path: 'transactions/pending',
        name: 'pending-transactions',
        component: () => import('@components/transactions/PendingTransactionsTable.vue'),
        meta: { requiresAuth: true },
        beforeEnter: () => {
          clearSelections(useTransactionsStore())
        },
      },
      {
        path: 'transactions/pending/:pendingTransactionId/edit',
        name: 'pending-transaction-edit',
        component: () => import('@components/transactions/TransactionEditPage.vue'),
        meta: { requiresAuth: true },
        props: true,
      },
      {
        path: 'transactions/:transactionId/edit',
        name: 'transaction-edit',
        component: () => import('@components/transactions/TransactionEditPage.vue'),
        meta: { requiresAuth: true },
        props: true,
      },
      {
        path: 'memos',
        name: 'memos',
        component: () => import('@components/memos/MemosTable.vue'),
        meta: { requiresAuth: true },
      },
      {
        path: 'memos/:memoId/summary',
        name: 'memo-summary',
        component: () => import('@components/memos/MemoSummaryTable.vue'),
        props: true,
        meta: { requiresAuth: true },
        beforeEnter: memoBeforeEnter,
      },
      {
        path: 'memos/:memoId/edit',
        name: 'memo-edit',
        component: () => import('@components/memos/MemoEditForm.vue'),
        meta: { requiresAuth: true },
        props: true,
        beforeEnter: memoBeforeEnter,
      },
      {
        path: 'budget-categories',
        name: 'budget-categories',
        component: () => import('@components/budget-categories/BudgetCategoriesPage.vue'),
        meta: { requiresAuth: true },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: LoginUser,
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@components/user-management/RegisterUser.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound,
  },
]

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})
