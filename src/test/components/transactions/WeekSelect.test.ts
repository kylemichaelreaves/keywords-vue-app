import WeekSelect from "@components/transactions/WeekSelect.vue";
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

        //     reset the store
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
    test('should not be disabled when there is a selectedMonth in the store', async () => {
        // wrapper.vm._pStores?.transactions.$patch((state) => {
        //     state.selectedMonth = '11/2022';
        // });

        transactionsStore.selectedMonth = '11/2022';


        await wrapper.vm.$nextTick();

        const select = wrapper.findComponent({name: 'ElSelect'})


        expect(select.vm.disabled).toBe(false);
    });

    test('should update selected week when model value changes', async () => {
        wrapper.vm._pStores?.transactions.$patch((state) => {
            state.selectedWeek = '42/2022';
        });

        // transactionsStore.setSelectedWeek('42/2022')
        transactionsStore.selectedWeek = '42/2022';

        // await wrapper.setProps({ selectedWeek: '12/2022' });
        await wrapper.vm.$nextTick();
        // console.log('wrapper.vm', wrapper.vm);

        const select = wrapper.findComponent({name: 'ElSelect'})
        console.log('select.vm', select.vm);


        // @ts-ignore
        expect(select.vm.modelValue).toBe('42/2022');
    })

    test('should enable select when selectedMonth is empty', async () => {
        transactionsStore.selectedMonth = '';
        await wrapper.vm.$nextTick();

        const select = wrapper.findComponent({name: 'ElSelect'})

        expect(select.vm.disabled).toBe(false);
    })

    test.skip('should populate weekOptions when data is available', async () => {
        // TODO: figure out how to set data in wrapper.vm, not in the store but through the VueQueryPlugin

        transactionsStore.weeks = [{week_year: '42/2022'}];

        // wrapper.vm.weekOptions = [{value: '42/2022', label: '42/2022'}];


        await wrapper.vm.$nextTick();


        const select = wrapper.findComponent({name: 'ElSelect'})

        // @ts-ignore
        expect(select.weekOptions).toEqual([{value: '42/2022', label: '42/2022'}]);
    })

    test('should not populate weekOptions when data is not available', async () => {
        transactionsStore.weeks = [];
        await wrapper.vm.$nextTick();
        // @ts-ignore
        expect(wrapper.vm.weekOptions).toEqual([]);
    })

    test.skip('updateSelectedWeek updates selectedWeek in the store', () => {
        const week = '42/2022';

        transactionsStore.setSelectedWeek(week);

        wrapper.vm._pStores?.transactions.setSelectedWeek(week);
        // wrapper.vm.setSelectedWeek(week);

        // @ts-ignore
        wrapper.vm.updateSelectedWeek(week);

        // console.log('wrapper.vm.getSelectedWeek', wrapper.vm.getSelectedWeek);
        // console.log('wrapper.vm.$refs', wrapper.vm.$refs);


        expect(transactionsStore.setSelectedWeek).toHaveBeenCalledWith(week);
    });

    test.skip('onMounted sets weeks in the store if data.value is truthy', async () => {
        // @ts-ignore
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
        // @ts-ignore
        wrapper.vm_pStores?.transactions.setWeeks([{week_year: '01/2023'}, {week_year: '02/2023'}]);
        await wrapper.vm.$nextTick();
        // @ts-ignore
        expect(wrapper.vm.weekOptions).toEqual([
            {value: '01/2023', label: '01/2023'},
            {value: '02/2023', label: '02/2023'}
        ]);
    });


})
