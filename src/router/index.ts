import Home from '@components/Home.vue'
import Keywords from '@components/Keywords.vue'
import AddressGeocoderForm from '@components/address/AddressGeocoderForm.vue'
import BudgetVisualizer from '@components/BudgetVisualizer.vue'
import LoanCalculator from '@components/loan/LoanCalculator.vue'
import Dashboard from '@components/Dashboard.vue'
import TransactionsTable from '@components/transactions/TransactionsTable.vue'
import PendingTransactionsTable from '@components/transactions/PendingTransactionsTable.vue'
import MonthSummaryTable from '@components/transactions/summaries/month/MonthSummaryTable.vue'
import WeekSummaryTable from '@components/transactions/summaries/week/WeekSummaryTable.vue'
import MemosTable from '@components/memos/MemosTable.vue'
import MemoSummaryTable from '@components/memos/MemoSummaryTable.vue'
import NotFound from '@components/NotFound.vue'
import LoginUser from '@components/user-management/LoginUser.vue'
import MemoEditForm from '@components/memos/MemoEditForm.vue'
import {
  createRouter,
  createWebHistory,
  type RouteLocationNormalized,
  // type NavigationGuardNext,
} from 'vue-router'
import { useTransactionsStore } from '@stores/transactions.ts'
import TransactionEditPage from '@components/transactions/TransactionEditPage.vue'
// import { checkForPendingTransactions } from '@api/helpers/checkForPendingTransactions'
// import { ElMessage } from 'element-plus'

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

export const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/keywords',
    name: 'keywords',
    component: Keywords,
    meta: { requiresAuth: true },
  },
  {
    path: '/address-geocoder',
    name: 'address-geocoder',
    component: AddressGeocoderForm,
    meta: { requiresAuth: true },
  },
  {
    path: '/budget-visualizer',
    name: 'budget-visualizer',
    component: BudgetVisualizer,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        redirect: { name: 'dashboard' },
      },
      {
        path: 'dashboard',
        name: 'dashboard',
        component: Dashboard,
        meta: { requiresAuth: true },
      },
      {
        path: 'debt',
        name: 'debt',
        component: LoanCalculator,
        meta: { requiresAuth: true },
      },
      {
        path: 'transactions',
        name: 'transactions',
        component: TransactionsTable,
        meta: { requiresAuth: true },
        // beforeEnter: async (
        //   to: RouteLocationNormalized,
        //   from: RouteLocationNormalized,
        //   next: NavigationGuardNext,
        // ) => {
        //   const hasPendingTransactions = await checkForPendingTransactions()
        //
        //   if (hasPendingTransactions) {
        //     ElMessage.warning({
        //       message:
        //         'You have pending ambiguous transactions to review. Redirecting to pending transactions page.',
        //       duration: 4000,
        //     })
        //
        //     next({ name: 'pending-transactions' })
        //   } else {
        //     const store = useTransactionsStore()
        //     store.setSelectedDay('')
        //     store.setSelectedWeek('')
        //     store.setSelectedMonth('')
        //     store.setSelectedYear('')
        //     store.setSelectedMemo('')
        //
        //     next()
        //   }
        // },
        children: [
          {
            path: 'months/:month/summary',
            name: 'month-summary',
            component: MonthSummaryTable,
            meta: { requiresAuth: true },
            beforeEnter: (to: RouteLocationNormalized) => {
              clearSelections(useTransactionsStore(), { month: to.params.month as string })
            },
          },
          {
            path: 'weeks/:week/summary/',
            name: 'week-summary',
            component: WeekSummaryTable,
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
        component: PendingTransactionsTable,
        meta: { requiresAuth: true },
        beforeEnter: () => {
          clearSelections(useTransactionsStore())
        },
      },
      {
        path: 'transactions/pending/:pendingTransactionId/edit',
        name: 'pending-transaction-edit',
        component: TransactionEditPage,
        meta: { requiresAuth: true },
        props: true,
      },
      {
        path: 'transactions/:transactionId/edit',
        name: 'transaction-edit',
        component: TransactionEditPage,
        meta: { requiresAuth: true },
        props: true,
      },
      {
        path: 'memos',
        name: 'memos',
        component: MemosTable,
        meta: { requiresAuth: true },
      },
      {
        path: 'memos/:memoId/summary',
        name: 'memo-summary',
        component: MemoSummaryTable,
        props: true,
        meta: { requiresAuth: true },
        beforeEnter: (to: RouteLocationNormalized) => {
          clearSelections(useTransactionsStore(), { memo: to.params.memoId as string })
        },
      },
      {
        path: 'memos/:memoId/edit',
        name: 'memo-edit',
        component: MemoEditForm,
        meta: { requiresAuth: true },
        props: true,
        beforeEnter: (to: RouteLocationNormalized) => {
          clearSelections(useTransactionsStore(), { memo: to.params.memoId as string })
        },
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
