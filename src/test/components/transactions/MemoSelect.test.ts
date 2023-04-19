import {vi, test} from 'vitest'
import {mount} from "@vue/test-utils";
import MemoSelect from "../../../components/transactions/MemoSelect.vue";
import {ElOption, ElSelect} from "element-plus";
import {VueQueryPlugin} from "@tanstack/vue-query";
import {createTestingPinia} from "@pinia/testing";

describe('MemoSelect', () => {
    const wrapper = mount(MemoSelect, {
        global: {
            plugins: [ElSelect, ElOption, VueQueryPlugin, createTestingPinia()],
        },
        props: {
            selectedMemo: '',
            'onUpdate:selectedMemo': (e: Event) => wrapper.setProps({selectedMemo: e})
        }
    })

    test('should render', () => {
        expect(wrapper.exists()).toBe(true)
    })

    test('should render the component and its options', async () => {
        expect(wrapper.findComponent(ElSelect).exists()).toBe(true)
    })

    test('clearable should be true', async () => {
        const selectComponent = wrapper.vm.$refs.selectComponent as InstanceType<typeof ElSelect>;
        expect(selectComponent.clearable).toBe(true);
    })
});