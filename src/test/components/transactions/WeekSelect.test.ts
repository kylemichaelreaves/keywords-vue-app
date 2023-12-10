import WeekSelect from "@components/transactions/WeekSelect.vue";
import {ElOption, ElSelect} from "element-plus";
import {createTestingPinia} from "@pinia/testing";
import {useTransactionsStore} from "@stores/transactions";
import {mount} from "@vue/test-utils";
import {VueQueryPlugin} from "@tanstack/vue-query";
import {test} from "vitest";

describe('WeekSelect', () => {

    const wrapper = mount(WeekSelect, {
        global: {
            plugins: [ElSelect, ElOption, VueQueryPlugin, createTestingPinia()],
        }
    })

    test('should render', () => {
        expect(wrapper.exists()).toBe(true)
    })

    test('clearable should be true', async () => {
        // @ts-ignore
        expect(wrapper.vm.$refs.selectComponent.clearable).toBe(true)
    })


    it("renders options and updates selectedMonth in the store", async () => {
        // Access the transactions store
        const transactionsStore = useTransactionsStore(createTestingPinia());

        // Get the transformedData from the component's setup function
        // @ts-ignore
        const transformedData = wrapper.vm.transformedData;

        // Assuming you have some transformed data to be rendered as options
        const options = wrapper.findAll("option");

        // Check if the correct number of options is rendered
        expect(options.length).toBe(transformedData.length);

        // Select the first option
        await wrapper.get("select").setValue(transformedData[0].value);

        // Check if the selectedMonth in the store is updated correctly
        expect(transactionsStore.getSelectedWeek).toBe(transformedData[0].value);
    });


    test.skip('should be disabled when there is a selectedMonth in the store', async () => {
        // Set up a store with a selectedMonth value
        const storeWithSelectedMonth = createTestingPinia();
        const transactionsStore = useTransactionsStore(storeWithSelectedMonth);
        transactionsStore.setSelectedMonth('11/2022');

        // Mount the component with the updated store
        const wrapperWithSelectedMonth = mount(WeekSelect, {
            global: {
                plugins: [ElSelect, ElOption, VueQueryPlugin, storeWithSelectedMonth],
            },
        });

        // Check if the select is disabled
        const select = wrapperWithSelectedMonth.getComponent(ElSelect);
        expect(select.props("disabled")).toBe(true);
    });

})
