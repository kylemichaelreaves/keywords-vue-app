import Home from '@components/Home.vue'
import Keywords from '@components/Keywords.vue'
import AddressGeocoderForm from '@components/address/AddressGeocoderForm.vue'
import BudgetVisualizer from '@components/BudgetVisualizer.vue'
import LoanCalculator from '@components/loan/LoanCalculator.vue'
import TransactionsTable from '@components/transactions/TransactionsTable.vue'
import MonthSummaryTable from '@components/transactions/MonthSummaryTable.vue'
import WeekSummaryTable from '@components/transactions/WeekSummaryTable.vue'
import MemosTable from '@components/transactions/MemosTable.vue'
import MemoSummaryTable from '@components/transactions/MemoSummaryTable.vue'
import NotFound from '@components/NotFound.vue'
import LoginUser from '@components/user-management/LoginUser.vue'
import MemoEditForm from '@components/transactions/MemoEditForm.vue'
import { createRouter, createWebHistory, type RouteLocationNormalized } from 'vue-router'
import { useTransactionsStore } from '@stores/transactions.ts'
import TransactionEditForm from '@components/transactions/TransactionEditForm.vue'


export const routes = [{
  path: '/',
  name: 'home',
  component: Home
},
  {
    path: '/keywords',
    name: 'keywords',
    component: Keywords,
    meta: { requiresAuth: true }
  },
  {
    path: '/address-geocoder',
    name: 'address-geocoder',
    component: () => AddressGeocoderForm,
    meta: { requiresAuth: true }
  },
  {
    path: '/budget-visualizer',
    name: 'budget-visualizer',
    component: BudgetVisualizer,
    meta: { requiresAuth: true },
    children: [
      {
        path: 'loan-calculator',
        name: 'loan-calculator',
        component: LoanCalculator,
        meta: { requiresAuth: true }
      },
      {
        path: 'chart-sandbox',
        name: 'chart-sandbox',
        component: () => import('@components/charts/BarChartWithSlider.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'transactions',
        name: 'transactions',
        component: TransactionsTable,
        meta: { requiresAuth: true },
        children: [
          {
            path: 'months/:month/summary',
            name: 'month-summary',
            component: MonthSummaryTable,
            meta: { requiresAuth: true },
            beforeEnter: (to: RouteLocationNormalized) => {
              const store = useTransactionsStore()
              // Clear any previous selections
              store.setSelectedDay('')
              store.setSelectedWeek('')
              store.setSelectedYear('')
              store.setSelectedMemo('')

              store.setSelectedMonth(to.params.month as string)
            }
          },
          {
            path: 'weeks/:week/summary/',
            name: 'week-summary',
            component: WeekSummaryTable,
            meta: { requiresAuth: true },
            props: true,
            beforeEnter: (to: RouteLocationNormalized) => {
              const store = useTransactionsStore()
              // clear any previous selections
              store.setSelectedDay('')
              store.setSelectedMonth('')
              store.setSelectedYear('')
              store.setSelectedMemo('')


              store.setSelectedWeek(to.params.week as string)
            }
          }
        ]
      },
      {
        path: 'transactions/:transactionId/edit',
        name: 'transaction-edit',
        component: TransactionEditForm,
        meta: { requiresAuth: true },
        props: true
      },
      {
        path: 'memos',
        name: 'memos',
        component: MemosTable,
        meta: { requiresAuth: true }
      },
      {
        path: 'memos/:memoName/summary',
        name: 'memo-summary',
        component: MemoSummaryTable,
        props: true,
        meta: { requiresAuth: true },
        beforeEnter: (to: RouteLocationNormalized) => {
          const store = useTransactionsStore()
          // clear any previous selections
          store.setSelectedDay('')
          store.setSelectedWeek('')
          store.setSelectedMonth('')
          store.setSelectedYear('')

          store.setSelectedMemo(to.params.memoName as string)
        }
      },
      {
        path: 'memos/:memoName/edit',
        name: 'memo-edit',
        component: MemoEditForm,
        meta: { requiresAuth: true },
        props: true,
        beforeEnter: (to: RouteLocationNormalized) => {
          const store = useTransactionsStore()
          // clear any previous selections
          store.setSelectedDay('')
          store.setSelectedWeek('')
          store.setSelectedMonth('')
          store.setSelectedYear('')
          store.setSelectedMemo(to.params.memoName as string)
        }
      },
      {
        path: 'budget-categories',
        name: 'budget-categories',
        component: () => import('@components/transactions/BudgetCategoriesTreeSelect.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: LoginUser
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@components/user-management/RegisterUser.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: NotFound
  }]


export const router = createRouter({
  history: createWebHistory(),
  routes: routes
})
