import {mount} from '@vue/test-utils';
import MonthSummaryTable from "@components/transactions/MonthSummaryTable.vue";
import {ElCard, ElStatistic, ElTable, ElTableColumn} from "element-plus";
import {VueQueryPlugin} from "@tanstack/vue-query";
import {createTestingPinia} from '@pinia/testing'
import {useTransactionsStore} from "@stores/transactions";
import {monthSummaryMock} from "../../../mocks/transaction";
import {server} from "@test/test-setup";

// Add this to the beginning of your test file or a test setup file
global.requestAnimationFrame = (cb) => {
    return setTimeout(cb, 0);
};
global.cancelAnimationFrame = (id) => {
    clearTimeout(id);
};

// Start the msw server before running the tests
beforeAll(() => {
    server.listen();
});

// Reset any runtime request handlers
afterEach(() => {
    server.resetHandlers();
});

// Clean up once the tests are done
afterAll(() => {
    server.close();
});


describe('MonthSummaryTable', function () {
    test.skip('renders the MonthlySummaryTable with the correct fields', async () => {
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

        console.log('wrapper', wrapper);

        // // Wait for the query to finish loading data
        // await waitFor(() => {
        //     expect(wrapper.vm.isLoading).toBe(false);
        // });

        const store = useTransactionsStore();

        store.selectedMonth = '01/2023';
        // Wait for the component to finish loading data
        // Wait for the loading state to be removed
        // wrapper.vm.isLoading = false;
        wrapper.vm.monthSummaryData = monthSummaryMock;
        await wrapper.vm.$nextTick();

        const table = wrapper.findComponent(ElTable);
        const columns = wrapper.findAllComponents(ElTableColumn);

        // Check if the table is rendered
        expect(table.exists()).toBe(true);

        // Check if the correct number of columns is rendered
        expect(columns.length).toBe(2);

        // Check if the correct column labels are rendered
        expect(columns[0].props('label')).toBe('Memo');

        // Check if the mocked data is displayed in the component
        const memoValue = wrapper.find('[data-testid="memo-monthly-summary"]').text();
        expect(memoValue).toBe(monthSummaryMock[0].memo);

        const debitValue = wrapper.find('[data-testid="monthly-amount-debit"]').text();
        expect(debitValue).toBe(monthSummaryMock[0].monthly_amount_debit.toString());


    });
})