import {vi, test} from 'vitest'
import {fireEvent, waitFor, screen, render} from "@testing-library/vue";
import MonthSelect from "../../../components/transactions/MonthSelect.vue";
import {renderWithQueryClient} from "../../renderWithQueryClient";
import {ElOption, ElSelect} from "element-plus";
import {VueQueryPlugin} from "@tanstack/vue-query";
import {mount} from "@vue/test-utils";
import {nextTick} from "vue";


describe('MonthsSelect', () => {


    test('should render', () => {
        const wrapper = mount(MonthSelect, {
            global: {
                plugins: [ElSelect, ElOption, VueQueryPlugin],
            }
        })

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
        const wrapper = mount(MonthSelect, {
            global: {
                plugins: [ElSelect, VueQueryPlugin],
            }
        })

        expect(wrapper.vm.$refs.selectComponent.clearable).toBe(true)
    })

    test('should clear the selected value when the clearable button is clicked', async () => {
        const wrapper = mount(MonthSelect, {
            global: {
                plugins: [ElSelect, VueQueryPlugin],
            }
        })

        await wrapper.findComponent(ElSelect).setValue('11/2022')

        await nextTick()

        await wrapper.findComponent(ElSelect).find('.el-select__caret').trigger('click')

        await nextTick()

        await wrapper.findComponent(ElSelect).find('.el-select-dropdown__item').trigger('click')

        await nextTick()

        expect(wrapper.vm.$refs.selectComponent.modelValue).toBe('')

        // const select = screen.findAllByDisplayValue(/select month/i)

        // await fireEvent.update(select, '11/2022')

        // await waitFor(() => {
        //     expect(screen.getByText('11/2022')).toBeInTheDocument()
        // })

        // screen.getByText('11/2022').click()


    });
})
