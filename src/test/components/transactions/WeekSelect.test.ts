import {vi, test} from 'vitest'
import {fireEvent, waitFor, screen, render} from "@testing-library/vue";
import WeekSelect from "../../../components/transactions/WeekSelect.vue";
import {ElOption, ElSelect} from "element-plus";
import {VueQueryPlugin} from "@tanstack/vue-query";
import {mount} from "@vue/test-utils";
import {createTestingPinia} from '@pinia/testing'
import {useTransactionsStore} from "../../../stores/transactionsStore";

describe('WeekSelect', () => {

    const wrapper = mount(WeekSelect, {
        global: {
            plugins: [ElSelect, ElOption, VueQueryPlugin, createTestingPinia()],
        }
    })

    test('should render', () => {
        expect(wrapper.exists()).toBe(true)
    })

    test('should render the component and its options', async () => {
        render(WeekSelect, {
            global: {
                plugins: [ElSelect, VueQueryPlugin],
            }
        })

        await waitFor(() => {
            expect(screen.getByPlaceholderText('select a week')).toBeInTheDocument()
            // Replace the following lines with the weeks you expect to be displayed
            expect(screen.getByText('01-2023')).toBeInTheDocument()
            expect(screen.getByText('02-2023')).toBeInTheDocument()
            expect(screen.getByText('03-2023')).toBeInTheDocument()
        })
    })

    test('clearable should be true', async () => {
        // @ts-ignore
        expect(wrapper.vm.$refs.selectComponent.clearable).toBe(true)
    })

    test('should emit the selected week', async () => {
        it("renders options and updates selectedWeek in the store", async () => {
            // Access the transactions store
            const transactionsStore = useTransactionsStore(createTestingPinia());

            // Get the weekOptions from the component's setup function
            const weekOptions = wrapper.vm.weekOptions;

            // Assuming you have some weekOptions data to be rendered as options
            const options = wrapper.findAllComponents({name: 'ElOption'});

            // Check if the correct number of options is rendered
            expect(options.length).toBe(weekOptions.length);

            // Select the first option
            await wrapper.get("select").setValue(weekOptions[0].value);

            // Check if the selectedWeek in the store is updated correctly
            expect(transactionsStore.getSelectedMemo).toBe(weekOptions[0].value);
        });
    })
})
