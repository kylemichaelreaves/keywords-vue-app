import {mount} from '@vue/test-utils'
import Navbar from '../../components/Navbar.vue'
import {routes} from "../../main";
import {createRouter, createWebHistory} from "vue-router";
import {ElTabPane, ElTabs} from "element-plus";

describe('Navbar.vue', () => {
    it('renders the correct number of tabs', () => {
        const router = createRouter({
            history: createWebHistory(),
            routes
        })
        const wrapper = mount(Navbar, {
            global: {
                components: {
                    ElTabs,
                    ElTabPane,
                },
                plugins: [router]
            },
        });

        const tabs = wrapper.findAllComponents(ElTabPane);
        expect(tabs.length).toBe(wrapper.vm.routes.length);
    });


    it('clicking on a tab changes the active tab', async () => {
        const router = createRouter({
            history: createWebHistory(),
            routes
        })
        const wrapper = mount(Navbar, {
            global: {
                components: {
                    ElTabs,
                    ElTabPane,
                },
                plugins: [router]
            },
        });

        const firstTab = wrapper.findComponent(ElTabPane);
        await firstTab.trigger('click');

        expect(wrapper.vm.activeTab).toBe(0);
    });


})
