import WeekSelect from "@components/transactions/WeekSelect.vue";
import {ElOption, ElSelect} from "element-plus";
import {createTestingPinia} from "@pinia/testing";
import type {TestingPinia} from "@pinia/testing";
import {useTransactionsStore} from "@stores/transactions";
import {mount, VueWrapper} from "@vue/test-utils";
import {VueQueryPlugin} from "@tanstack/vue-query";
import {afterEach, test} from "vitest";

describe('WeekSelect', () => {
    let store: TestingPinia;
    let transactionsStore: ReturnType<typeof useTransactionsStore>;
    let wrapper: VueWrapper;

    beforeEach(async () => {
        store = createTestingPinia();
        transactionsStore = useTransactionsStore(store);
        wrapper = mount(WeekSelect, {
            global: {
                plugins: [ElSelect, ElOption, VueQueryPlugin, createTestingPinia({
                    initialState: {
                        transactions: {
                            weeks: [],
                            selectedMonth: '',
                            selectedWeek: '',
                        }
                    }
                })],
            },
        });
    })

    afterEach(() => {
        vi.resetAllMocks()

        //     reset the store
        transactionsStore.selectedMonth = '';
        transactionsStore.selectedWeek = '';
        transactionsStore.weeks = [];
    })


    test('should render', () => {
        expect(wrapper.exists()).toBe(true)
    })

    test('clearable should be true', async () => {
        // @ts-ignore
        expect(wrapper.vm.$refs.selectComponent.clearable).toBe(true)
    })

    test('should be disabled when there is a selectedMonth in the store', async () => {
        wrapper.vm._pStores?.transactions.$patch((state) => {
            state.selectedMonth = '11/2022';
        });
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.$refs.selectComponent.disabled).toBe(true);
    });

    test('should update selected week when model value changes', async () => {
        wrapper.vm._pStores?.transactions.$patch((state) => {
            state.selectedWeek = '42/2022';
        });

        // await wrapper.setProps({ selectedWeek: '12/2022' });
        await wrapper.vm.$nextTick();
        // @ts-ignore
        expect(wrapper.vm.$refs.selectComponent.modelValue).toBe('42/2022');
    })

    test('should enable select when selectedMonth is empty', async () => {
        transactionsStore.selectedMonth = '';
        await wrapper.vm.$nextTick();
        // @ts-ignore
        expect(wrapper.vm.$refs.selectComponent.disabled).toBe(false);
    })

    test.skip('should populate weekOptions when data is available', async () => {
        wrapper.vm._pStores?.transactions.$patch((state) => {
            state.weeks = ['42/2022'];
        });

        await wrapper.vm.$nextTick();

        console.log('wrapper.vm', wrapper.vm);
        // @ts-ignore
        expect(wrapper.vm.weekOptions).toEqual([{value: '42/2022', label: '42/2022'}, {
            value: '42/2022',
            label: '42/2022'
        }]);
    })

    test('should not populate weekOptions when data is not available', async () => {
        transactionsStore.weeks = [];
        await wrapper.vm.$nextTick();
        // @ts-ignore
        expect(wrapper.vm.weekOptions).toEqual([]);
    })

    test.skip('updateSelectedWeek updates selectedWeek in the store', () => {
        const week = '42/2022';

        wrapper.vm._pStores?.transactions.setSelectedWeek(week);
        // wrapper.vm.setSelectedWeek(week);
        wrapper.vm.updateSelectedWeek(week);

        // console.log('wrapper.vm.getSelectedWeek', wrapper.vm.getSelectedWeek);
        // console.log('wrapper.vm.$refs', wrapper.vm.$refs);

        console.log('wrapper.vm.selectedWeek', wrapper.vm.selectedWeek.value);

        console.log('wrapper.vm', wrapper.vm);


        expect(transactionsStore.setSelectedWeek).toHaveBeenCalledWith(week);
    });

    test.skip('onMounted sets weeks in the store if data.value is truthy', async () => {
        wrapper.vm.setData([{value: '42/2022', label: '42/2022'}]);

        console.log('wrapper.vm', wrapper.vm);

        wrapper.vm._pStores?.transactions.$patch((state) => {
            state.weeks = ['42/2022'];
        });

        await wrapper.vm.$nextTick();
        expect(transactionsStore.setWeeks).toHaveBeenCalledWith(transactionsStore.weeks);
    });

    test.skip('weekOptions maps data.value to the required format', () => {
        const expectedWeekOptions = transactionsStore.weeks.map(week => ({
            value: week.week_year,
            label: week.week_year
        }));
        expect(wrapper.vm.$refs.weekOptions).toEqual(expectedWeekOptions);
    });

    test.skip('selectedWeek returns selectedWeek from the store', () => {
        expect(wrapper.vm.$refs.selectedWeek).toBe(transactionsStore.getSelectedWeek);
    });

    test.skip('selectedMonth returns selectedMonth from the store', () => {
        expect(wrapper.vm.$refs.selectedMonth).toBe(transactionsStore.getSelectedMonth);
    });

    test.skip('should update weekOptions when weeks data changes', async () => {
        wrapper.vm_pStores?.transactions.setWeeks([{week_year: '01/2023'}, {week_year: '02/2023'}]);
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.weekOptions).toEqual([
            {value: '01/2023', label: '01/2023'},
            {value: '02/2023', label: '02/2023'}
        ]);
    });


})
