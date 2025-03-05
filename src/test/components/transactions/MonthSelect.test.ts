import {vi, test} from 'vitest'
import {waitFor, screen, render} from "@testing-library/vue";
import MonthSelect from "@components/transactions/MonthSelect.vue";
import {ElOption, ElSelect} from "element-plus";
import {VueQueryPlugin} from "@tanstack/vue-query";
import {mount} from "@vue/test-utils";
import {createTestingPinia} from '@pinia/testing'
import {useTransactionsStore} from "@stores/transactions";
import {monthsMock} from "@mocks/transaction";

describe('MonthsSelect', () => {
    const wrapper = mount(MonthSelect, {
        props: {
            options: monthsMock,
            selectedValue: '11/2022',
            placeholder: 'Select a month',
            onChange: vi.fn()
        },
        global: {
            plugins: [VueQueryPlugin, createTestingPinia(
                {
                    initialState: {
                        transactions: {
                            selectedMonth: '11/2022',
                        }
                    }
                }
            )],
        }
    })

    test('should render', () => {
        expect(wrapper.exists()).toBe(true)
    })

    test.skip('should render the component and its options', async () => {
        await waitFor(() => {
            expect(screen.getByPlaceholderText('select month')).toBeInTheDocument()
            expect(screen.getByText('11/2022')).toBeInTheDocument()
            expect(screen.getByText('12/2022')).toBeInTheDocument()
            expect(screen.getByText('01/2023')).toBeInTheDocument()
        })
    })

    test('clearable should be true', async () => {
        const select = wrapper.findComponent({name: 'ElSelect'})
        expect(select.vm.clearable).toBe(true)
    })


    it.skip("renders options and updates selectedMonth in the store", async () => {
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
        expect(transactionsStore.getSelectedMonth).toBe(transformedData[0].value);
    });


    test.skip('should disable the select when there is a selectedWeek in the store', async () => {
        // Set up a store with a selectedWeek value
        const storeWithSelectedWeek = createTestingPinia();
        const transactionsStore = useTransactionsStore(storeWithSelectedWeek);
        transactionsStore.setSelectedWeek('02-2023');

        // Mount the component with the updated store
        const wrapperWithSelectedWeek = mount(MonthSelect, {
            global: {
                plugins: [ElSelect, ElOption, VueQueryPlugin, storeWithSelectedWeek],
            },
        });

        // Check if the select is disabled
        const select = wrapperWithSelectedWeek.findComponent(ElSelect);
        // Check if the select is disabled
        expect(select.props("disabled")).toBe(true);

    });
})
