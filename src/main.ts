import {createApp} from 'vue'
import {createRouter, createWebHistory} from "vue-router";
import {VueQueryPlugin} from "@tanstack/vue-query";
import {createPinia} from 'pinia'
import './style.css'
import App from './App.vue'
import Keywords from "./components/Keywords.vue";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import AddressGeocoder from "./components/AddressGeocoder.vue";

const pinia = createPinia()

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: App
        },
        {
            path: '/keywords',
            component: Keywords
        },
        {
            path: '/address-geocoder',
            component: AddressGeocoder
        },
    ]
})

createApp(App)
    .use(router)
    .use(VueQueryPlugin)
    .use(pinia)
    .use(ElementPlus)
    .mount('#app')
