import Home from '@components/Home.vue'
import Keywords from '@components/Keywords.vue'
import AddressGeocoderForm from '@components/address/AddressGeocoderForm.vue'
import BudgetVisualizer from '@components/BudgetVisualizer.vue'
import LoanCalculator from '@components/loan/LoanCalculator.vue'
import TransactionsTable from '@components/transactions/TransactionsTable.vue'
import MonthSummaryTable from '@components/transactions/MonthSummaryTable.vue'
import WeekSummaryTable from '@components/transactions/WeekSummaryTable.vue'
import TransactionSummaryTable from '@components/transactions/TransactionSummaryTable.vue'
import MemosTable from '@components/transactions/MemosTable.vue'
import MemoSummaryTable from '@components/transactions/MemoSummaryTable.vue'
import BudgetCategoriesTreeSelect from '@components/transactions/BudgetCategoriesTreeSelect.vue'
import NotFound from '@components/NotFound.vue'
import LoginUser from '@components/user-management/LoginUser.vue'
import { createRouter, createWebHistory } from 'vue-router'

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
            path: 'summary/month/:month',
            name: 'month-summary',
            component: MonthSummaryTable,
            meta: { requiresAuth: true },
            props: true
          },
          {
            path: 'summary/week/:week',
            name: 'week-summary',
            component: WeekSummaryTable,
            meta: { requiresAuth: true },
            props: true
          }
        ]
      },
      {
        path: 'transactions/:transactionNumber',
        name: 'transaction',
        component: TransactionSummaryTable,
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
        path: 'memos/:memoName',
        name: 'memo',
        component: MemoSummaryTable,
        props: true,
        meta: { requiresAuth: true }
      },
      {
        path: 'budget-categories',
        name: 'budget-categories',
        component: BudgetCategoriesTreeSelect,
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

