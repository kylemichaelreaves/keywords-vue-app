import WeekSelect from "@components/transactions/WeekSelect.vue";
import {createTestingPinia} from "@pinia/testing";
import type {TestingPinia} from "@pinia/testing";
import {useTransactionsStore} from "@stores/transactions";
import {mount, VueWrapper} from "@vue/test-utils";
import {VueQueryPlugin} from "@tanstack/vue-query";
import {afterEach, test, vi} from "vitest";

describe('WeekSelect', () => {
    let store: TestingPinia;
    let transactionsStore: ReturnType<typeof useTransactionsStore>;
    let wrapper: VueWrapper;


    beforeEach(async () => {
        store = createTestingPinia();
        transactionsStore = useTransactionsStore(store);
        wrapper = mount(WeekSelect, {
            global: {
                plugins: [VueQueryPlugin,
                    createTestingPinia({
                        initialState: {
                            transactions: {
                                weeks: [],
                                selectedMonth: '',
                                selectedWeek: '',
                            }
                        },
                        stubActions: false,
                    })],
            }
        });
    })

    afterEach(() => {
        vi.resetAllMocks()
        transactionsStore.selectedMonth = '';
        transactionsStore.selectedWeek = '';
        transactionsStore.weeks = [];
    })


    test('should render', () => {
        expect(wrapper.exists()).toBe(true)
    })

    test('clearable should be true', async () => {
        const select = wrapper.findComponent({name: 'ElSelect'})
        expect(select.vm.clearable).toBe(true)
    })

    // TODO when there is a selectedMonth, the weeks of that month should populate the weekSelect
    test.skip('should not be disabled when there is a selectedMonth in the store', async () => {


        wrapper.vm._pStores?.transactions.$patch((state) => {
            state.selectedWeek = '11/2022';
        });

        await wrapper.vm.$nextTick();


        const select = wrapper.findComponent({name: 'ElSelect'})


        expect(select.vm.select).toBe(false);
    });

    test('should update selected week when model value changes', async () => {
        wrapper.vm._pStores?.transactions.$patch((state) => {
            state.selectedWeek = '42/2022';
        });

        transactionsStore.selectedWeek = '42/2022';


        await wrapper.vm.$nextTick();


        const select = wrapper.findComponent({name: 'ElSelect'})


        // @ts-expect-error - Type testing
        expect(select.vm.modelValue).toBe('42/2022');
    })

    test.skip('should populate weekOptions when data is available', async () => {
        // TODO: figure out how to set data in wrapper.vm, not in the store but through the VueQueryPlugin

        transactionsStore.weeks = [{week_year: '42/2022'}];


        await wrapper.vm.$nextTick();


        const select = wrapper.findComponent({name: 'ElSelect'})

        // @ts-expect-error - Type testing
        expect(select.weekOptions).toEqual([{value: '42/2022', label: '42/2022'}]);
    })

    test('should not populate weekOptions when data is not available', async () => {
        transactionsStore.weeks = [];
        await wrapper.vm.$nextTick();
        // @ts-expect-error - Type testing
        expect(wrapper.vm.weekOptions).toEqual([]);
    })

    test('updateSelectedWeek updates selectedWeek in the store', () => {
        const week = '42/2022';

        transactionsStore.setSelectedWeek(week);

        wrapper.vm._pStores?.transactions.setSelectedWeek(week);

        // @ts-expect-error - Type testing
        wrapper.vm.updateSelectedWeek(week);


        expect(transactionsStore.setSelectedWeek).toHaveBeenCalledWith(week);
    });

    test.skip('weekOptions maps data.value to the required format', () => {
        const expectedWeekOptions = transactionsStore.weeks.map(week => ({
            value: week.week_year,
            label: week.week_year
        }));
        expect(wrapper.vm.$refs.weekOptions).toEqual(expectedWeekOptions);
    });

    test.skip('selectedWeek returns selectedWeek from the store', async () => {
        const week = '42/2022';
        wrapper.vm._pStores?.transactions.$patch((state) => {
            state.selectedWeek = '42/2022';
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.$refs.selectedWeek).toBe(week);
        // expect(wrapper.vm.$refs.selectedWeek).toBe(transactionsStore.getSelectedWeek);
    });

    test.skip('selectedMonth returns selectedMonth from the store', () => {
        expect(wrapper.vm.$refs.selectedMonth).toBe(transactionsStore.getSelectedMonth);
    });

})
