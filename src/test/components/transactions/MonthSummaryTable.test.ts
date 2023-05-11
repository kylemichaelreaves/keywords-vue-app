import {mount} from '@vue/test-utils';
import MonthSummaryTable from "../../../components/transactions/MonthSummaryTable.vue";
import {ElCard, ElStatistic, ElTable, ElTableColumn} from "element-plus";
import {VueQueryPlugin} from "@tanstack/vue-query";
import {createTestingPinia} from '@pinia/testing'
import {useTransactionsStore} from "../../../stores/transactionsStore";

describe('MonthlySummaryTable', function () {
    test('renders the MonthlySummaryTable with the correct fields', async () => {
        const wrapper = mount(MonthSummaryTable, {
            global: {
                components: {
                    ElTable,
                    ElStatistic,
                    ElTableColumn,
                    ElCard,
                },
                plugins: [VueQueryPlugin, createTestingPinia()],
            }
        });

        const store = useTransactionsStore();

        store.selectedMonth = '01/2023';
        // Wait for the component to finish loading data
        await wrapper.vm.$nextTick();

        const table = wrapper.findComponent(ElTable);
        const columns = wrapper.findAllComponents(ElTableColumn);

        // Check if the table is rendered
        expect(table.exists()).toBe(true);

        // Check if the correct number of columns is rendered
        expect(columns.length).toBe(2);

        // Check if the correct column labels are rendered
        expect(columns[0].props('label')).toBe('Memo');

        const memo = wrapper.find('[data-testid="memo-monthly-summary"]');
        const monthlyAmountDebit = wrapper.find('[data-testid="monthly-amount-debit"]');


    });
})