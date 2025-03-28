import {mount} from '@vue/test-utils';
import MemoSummaryTable from '@components/transactions/MemoSummaryTable.vue';
import {ElCard, ElStatistic, ElTable, ElTableColumn} from "element-plus";
import {VueQueryPlugin} from "@tanstack/vue-query";
import {createTestingPinia} from '@pinia/testing'
import {useTransactionsStore} from "@stores/transactions";
import {vi} from "vitest";

describe.skip('MemoSummaryTable.vue', () => {
    const wrapper = mount(MemoSummaryTable, {
        global: {
            components: {
                ElTable,
                ElStatistic,
                ElTableColumn,
                ElCard,
            },
            plugins: [VueQueryPlugin, createTestingPinia(
                {
                    initialState: {
                        transactions: {
                            selectedMonth: '',
                            selectedWeek: '',
                            selectedDay: '',
                            selectedMemo: '',
                        }
                    },
                    stubActions: false,
                }
            )],
        },
        provide: {
            memoTableData:
                [{
                    transactions_count: 'Memo: Test 1',
                    sum_amount_debit: -300,
                }],
        }
    });


    afterEach(() => {
        vi.clearAllMocks()
        vi.clearAllTimers()
    })


    test.skip('renders the MemoSummaryTable with the correct fields', async () => {


        const store = useTransactionsStore();

        store.selectedMemo = 'Memo: Test';
        // Wait for the component to finish loading data
        await wrapper.vm.$nextTick();

        const table = wrapper.findComponent(ElTable);
        const columns = wrapper.findAllComponents(ElTableColumn);

        // Check if the table is rendered
        expect(table.exists()).toBe(true);

        // Check if the correct number of columns is rendered
        expect(columns.length).toBe(2);

        // Check if the correct column labels are rendered
        expect(columns[0].props('label')).toBe('Sum Amount Debit');
        expect(columns[1].props('label')).toBe('Transactions Count');


        const sumAmountDebit = wrapper.find('[data-testid="sum-amount-debit"]');
        const transactionsCount = wrapper.find('[data-testid="transactions-count"]');

        // TODO Figure out a way to mock the hooks so that the components which depend on them can be tested
        // expect(sumAmountDebit.text()).toBe("100");
        // expect(transactionsCount.text()).toBe("1");


    });

});