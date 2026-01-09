import {mount} from '@vue/test-utils';
import WeekSummaryTable from "@components/transactions/WeekSummaryTable.vue";
import {ElCard, ElStatistic, ElTable, ElTableColumn} from "element-plus";
import {VueQueryPlugin} from "@tanstack/vue-query";
import {createTestingPinia} from '@pinia/testing'
import {useTransactionsStore} from "@stores/transactions";


describe('WeekSummaryTable', function () {

    afterEach(() => {
        vi.clearAllMocks()
        vi.clearAllTimers()
    })

    test.skip('renders the WeekSummaryTable with the correct fields', async () => {

        const _wrapper = mount(WeekSummaryTable, {
            global: {
                components: {
                    ElTable,
                    ElStatistic,
                    ElTableColumn,
                    ElCard,
                },
                plugins: [VueQueryPlugin, createTestingPinia()],
            },
        });

        const store = useTransactionsStore();

        store.selectedWeek = '01-2023';
        // Wait for the component to finish loading data
        await wrapper.vm.$nextTick();

        const _table = wrapper.findComponent(ElTable);
        const columns = wrapper.findAllComponents(ElTableColumn);

        // Check if the table is rendered
        expect(table.exists()).toBe(true);

        // Check if the correct number of columns is rendered
        expect(columns.length).toBe(2);

        // Check if the correct column labels are rendered
        expect(columns[0].props('label')).toBe('Memo');
        expect(columns[1].props('label')).toBe('Weekly Amount Debit');

        wrapper.find('[data-testid="memo-week-summary"]');
        wrapper.find('[data-testid="weekly-amount-debit"]');

        // TODO mock the hooks so that the components which depend on them can be tested
        // expect(memo.text()).toBe("Example Memo");
        // expect(weeklyAmountDebit.text()).toBe("100");

    });
});