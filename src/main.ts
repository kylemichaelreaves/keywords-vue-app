import {createApp} from 'vue'
import {createRouter, createWebHistory} from "vue-router";
import type {RouteRecordRaw} from "vue-router";
import {VueQueryPlugin} from "@tanstack/vue-query";
import {createPinia} from 'pinia'
import './style.css'
import App from './App.vue'
import Keywords from "@components/Keywords.vue";
import Home from "@components/Home.vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import BudgetVisualizer from "@components/BudgetVisualizer.vue";
import MemoSummaryTable from "@components/transactions/MemoSummaryTable.vue";
import AddressGeocoderForm from "@components/address/AddressGeocoderForm.vue";
import 'element-plus/theme-chalk/dark/css-vars.css'
import BudgetCategoriesTreeSelect from "@components/transactions/BudgetCategoriesTreeSelect.vue";
import MemosTable from "@components/transactions/MemosTable.vue";
import NotFound from "@components/NotFound.vue";
import TransactionsTable from "@components/transactions/TransactionsTable.vue";
import LoanCalculator from "@components/loan/LoanCalculator.vue";
// import Login from "@components/user-management/Login.vue";
import TransactionSummaryTable from "@components/transactions/TransactionSummaryTable.vue";
import MonthSummaryTable from "@components/transactions/MonthSummaryTable.vue";
import WeekSummaryTable from "@components/transactions/WeekSummaryTable.vue";
import VueTippy from 'vue-tippy'

const pinia = createPinia()

export const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'home',
        component: Home
    },
    {
        path: '/keywords',
        name: 'keywords',
        component: Keywords
    },
    {
        path: '/address-geocoder',
        name: 'address-geocoder',
        component: () => AddressGeocoderForm
    },
    {
        path: '/budget-visualizer',
        name: 'budget-visualizer',
        component: BudgetVisualizer,
        children: [
            {
                path: 'loan-calculator',
                name: 'loan-calculator',
                component: LoanCalculator
            },
            {
                path: 'transactions',
                name: 'transactions',
                component: TransactionsTable,
                children: [
                    {
                        path: ':transactionNumber',
                        name: 'transaction',
                        component: TransactionSummaryTable,
                        props: true
                    },
                    {
                        path: 'summary/month/:month',
                        name: 'month-summary',
                        component: MonthSummaryTable,
                        props: true
                    },
                    {
                        path: 'summary/week/:week',
                        name: 'week-summary',
                        component: WeekSummaryTable,
                        props: true
                    }
                ]
            },
            {
                path: 'memos',
                name: 'memos',
                component: MemosTable,
                props: true,
            },
            {
                path: 'memos/:memo',
                name: 'memo',
                component: MemoSummaryTable,
                props: true

            },
            {
                path: 'budget-categories',
                name: 'budget-categories',
                component: BudgetCategoriesTreeSelect,
            },
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'not-found',
        component: NotFound
    },
];

export const router = createRouter({
    history: createWebHistory(),
    routes: routes as RouteRecordRaw[]
})

const app = createApp(App)

app
    .use(router)
    .use(VueQueryPlugin)
    .use(pinia)
    .use(ElementPlus)
    .use(VueTippy)
    .mount('#app')

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

if (!app._container) {
    app.mount('#app');
}

if (import.meta.hot) {
    import.meta.hot.accept();
    import.meta.hot.dispose(() => {
        app.unmount();
    });
}