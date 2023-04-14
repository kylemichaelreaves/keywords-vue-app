import {vi, test} from 'vitest'
import {fireEvent, waitFor, screen, render} from "@testing-library/vue";
import MonthSelect from "../../../components/transactions/MonthSelect.vue";
import {ElOption, ElSelect} from "element-plus";
import {VueQueryPlugin} from "@tanstack/vue-query";
import {mount} from "@vue/test-utils";
import {createTestingPinia} from '@pinia/testing'
import {useTransactionsStore} from "../../../stores/transactionsStore";

describe('MonthsSelect', () => {

    const wrapper = mount(MonthSelect, {
        global: {
            plugins: [ElSelect, ElOption, VueQueryPlugin, createTestingPinia()],
        }
    })

    test('should render', () => {
        expect(wrapper.exists()).toBe(true)
    })

    test('should render the component and its options', async () => {
        render(MonthSelect, {
            global: {
                plugins: [ElSelect, VueQueryPlugin],
            }
        })

        await waitFor(() => {
            expect(screen.getByPlaceholderText('select month')).toBeInTheDocument()
            expect(screen.getByText('11/2022')).toBeInTheDocument()
            expect(screen.getByText('12/2022')).toBeInTheDocument()
            expect(screen.getByText('01/2023')).toBeInTheDocument()
        })
    })

    test('clearable should be true', async () => {
        // @ts-ignore
        expect(wrapper.vm.$refs.selectComponent.clearable).toBe(true)
    })

    test('should emit the selected month', async () => {
        it("renders options and updates selectedMonth in the store", async () => {
            // Access the transactions store
            const transactionsStore = useTransactionsStore(createTestingPinia());

            // Get the transformedData from the component's setup function
            const transformedData = wrapper.vm.transformedData;

            // Assuming you have some transformed data to be rendered as options
            const options = wrapper.findAll("option");

            // Check if the correct number of options is rendered
            expect(options.length).toBe(transformedData.length);

            // Select the first option
            await wrapper.get("select").setValue(transformedData[0].value);

            // Check if the selectedMonth in the store is updated correctly
            expect(transactionsStore.getSelectedMonth).toBe(transformedData[0].value);
        });
    })
})
