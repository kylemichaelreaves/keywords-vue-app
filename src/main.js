"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = exports.routes = void 0;
var vue_1 = require("vue");
var vue_router_1 = require("vue-router");
var vue_query_1 = require("@tanstack/vue-query");
var pinia_1 = require("pinia");
require("./style.css");
var App_vue_1 = require("./App.vue");
var Keywords_vue_1 = require("@components/Keywords.vue");
var Home_vue_1 = require("@components/Home.vue");
var Navbar_vue_1 = require("@components/Navbar.vue");
var AddressGeocoderForm_vue_1 = require("@components/address/AddressGeocoderForm.vue");
var element_plus_1 = require("element-plus");
require("element-plus/dist/index.css");
var ElementPlusIconsVue = require("@element-plus/icons-vue");
var Transaction_vue_1 = require("@components/transactions/Transaction.vue");
var BudgetVisualizer_vue_1 = require("@components/BudgetVisualizer.vue");
var TransactionsTable_vue_1 = require("@components/transactions/TransactionsTable.vue");
var MemoSummaryTable_vue_1 = require("@components/transactions/MemoSummaryTable.vue");
require("element-plus/theme-chalk/dark/css-vars.css");
var pinia = (0, pinia_1.createPinia)();
exports.routes = [
    {
        path: '/',
        name: 'home',
        component: Home_vue_1.default
    },
    {
        path: '/keywords',
        name: 'keywords',
        component: Keywords_vue_1.default
    },
    {
        path: '/address-geocoder',
        name: 'address-geocoder',
        component: AddressGeocoderForm_vue_1.default
    },
    {
        path: '/budget-visualizer',
        name: 'budget-visualizer',
        component: BudgetVisualizer_vue_1.default,
        children: [
            {
                path: 'transactions',
                name: 'transactions',
                component: TransactionsTable_vue_1.default,
                children: [
                    {
                        path: ':transactionNumber',
                        name: 'Transaction',
                        component: Transaction_vue_1.default,
                        props: true,
                    },
                ]
            },
            {
                path: 'memos/:memo',
                name: 'MemoSummaryTable',
                component: MemoSummaryTable_vue_1.default,
                props: true,
            },
        ]
    }
];
exports.router = (0, vue_router_1.createRouter)({
    history: (0, vue_router_1.createWebHistory)(),
    routes: exports.routes
});
var app = (0, vue_1.createApp)(App_vue_1.default);
for (var _i = 0, _a = Object.entries(ElementPlusIconsVue); _i < _a.length; _i++) {
    var _b = _a[_i], key = _b[0], component = _b[1];
    app.component(key, component);
}
app
    .use(exports.router)
    .use(vue_query_1.VueQueryPlugin)
    .use(pinia)
    .use(element_plus_1.default)
    .mount('#app');
app.component('Navbar', Navbar_vue_1.default);
