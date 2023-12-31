import TransactionsTable from "@components/transactions/TransactionsTable.vue";
import {mount, VueWrapper} from "@vue/test-utils";
import {test} from "vitest";
import {transactionsMock} from "@mocks/transaction";
import {ElTable, ElTableColumn} from "element-plus";
import {mockRouter} from "@test/router.mock";
import {createTestingPinia} from "@pinia/testing";
import type {TestingPinia} from "@pinia/testing";
import {useTransactionsStore} from "@stores/transactions";

describe.skip("TransactionsTable", async () => {
    let store: TestingPinia;
    let transactionsStore: ReturnType<typeof useTransactionsStore>;
    let wrapper: VueWrapper;

    beforeEach(async () => {
        store = createTestingPinia();
        transactionsStore = useTransactionsStore(store);
        wrapper = mount(TransactionsTable, {
            props: {
                displayData: {rows: transactionsMock},
                linkedColumns: [],
                isFetching: false,
            },
            global: {
                plugins: [mockRouter, ElTable, ElTableColumn, createTestingPinia(
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
        });
    });

    afterEach(() => {
        vi.resetAllMocks()

        //     reset the store
        transactionsStore.selectedMonth = '';
        transactionsStore.selectedWeek = '';
        transactionsStore.weeks = [];
    });

    test("renders the correct number of columns", async () => {
        const linkedColumns = ["transactionNumber", "memo"];

        await wrapper.setProps({linkedColumns: linkedColumns})

        await wrapper.vm.$nextTick();

        const tableHeaderCells = wrapper.find("thead").findAll("th");
        expect(tableHeaderCells.length).toBe(Object.keys(transactionsMock[0]).length);
    });

    test("renders the correct number of columns with linked columns", async () => {
        const displayData = {
            rows: [
                {transactionNumber: "12345", date: "2023-01-01"},
                // Add other rows as needed
            ],
        };

        await wrapper.vm.$nextTick();

        const tableHeaderCells = wrapper.find("thead").findAll("th");
        expect(tableHeaderCells.length).toBe(Object.keys(displayData.rows[0]).length);
    });
});

