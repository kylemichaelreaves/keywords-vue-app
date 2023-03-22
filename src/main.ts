import {createApp} from 'vue'
import {createRouter, createWebHistory} from "vue-router";
import {VueQueryPlugin} from "@tanstack/vue-query";
import {createPinia} from 'pinia'
import './style.css'
import App from './App.vue'
import Keywords from "./components/Keywords.vue";
import Home from "./components/Home.vue";
import Navbar from "./components/Navbar.vue";
import AddressGeocder from "./components/address/AddressGeocoder.vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import Transactions from "./components/transactions/Transactions.vue";
import TransactionsByMonth from "./components/transactions/TransactionsByMonth.vue";
import TransactionsByMemo from "./components/transactions/TransactionsByMemo.vue";
import Transaction from "./components/transactions/Transaction.vue";
import BudgetVisualizer from "./components/BudgetVisualizer.vue";


const pinia = createPinia()

export const routes = [
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
        component: AddressGeocder
    },
    {
        path: '/budget-visualizer',
        name: 'budget-visualizer',
        component: BudgetVisualizer,
        children: [
            {
                path: 'transactions',
                name: 'transactions',
                component: Transactions,
                children: [
                    {
                        path: 'by-month/:month',
                        name: 'TransactionsByMonth',
                        component: TransactionsByMonth
                    },
                    {
                        path: 'by-memo/:memo',
                        name: 'TransactionsByMemo',
                        component: TransactionsByMemo
                    },
                    {
                        path: '/transaction/:transactionNumber',
                        name: 'Transaction',
                        component: Transaction,
                        props: true,
                    },

                ]
            }
        ]
    }
]


export const router = createRouter({
    history: createWebHistory(),
    routes
})

const app = createApp(App)

for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app
    .use(router)
    .use(VueQueryPlugin)
    .use(pinia)
    .use(ElementPlus)
    .mount('#app')

app.component('Navbar', Navbar)


