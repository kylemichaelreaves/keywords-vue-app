import {mount, VueWrapper} from '@vue/test-utils'
import Navbar from '@components/Navbar.vue'
import {routes} from "@main";
import {createRouter, createWebHistory} from "vue-router";
import {ElTabPane, ElTabs} from "element-plus";
import {beforeEach} from "vitest";

describe('Navbar.vue', () => {
    let wrapper: VueWrapper;

    beforeEach(() => {
        const router = createRouter({
            history: createWebHistory(),
            routes: routes
        })

        wrapper = mount(Navbar, {
            global: {
                components: {
                    ElTabs,
                    ElTabPane,
                },
                plugins: [router]
            },
        });
    });


    it.skip('renders the correct number of tabs', () => {
        const tabs = wrapper.findAllComponents(ElTabPane);
        // @ts-ignore
        expect(tabs.length).toBe(wrapper.vm.routes.length);
    });


    it('clicking on a tab changes the active tab', async () => {
        const firstTab = wrapper.findComponent(ElTabPane);
        await firstTab.trigger('click');

        // @ts-ignore
        expect(wrapper.vm.activeTab).toBe(0);
    });


})
