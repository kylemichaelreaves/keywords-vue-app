import TransactionsTable from "@components/transactions/TransactionsTable.vue";
import {mount} from "@vue/test-utils";
import {test} from "vitest";
import {transactionsMock} from "@test/mock/transaction";
import {ElTable, ElTableColumn} from "element-plus";
import {mockRouter} from "@test/router.mock";

describe.skip("TransactionsTable", async () => {
    test("renders the correct number of columns", async () => {
        const linkedColumns = ["transactionNumber", "memo"];

        const wrapper = mount(TransactionsTable, {
            props: {
                displayData: {rows: transactionsMock},
                linkedColumns: linkedColumns,
                isFetching: false,
            },
            global: {
                plugins: [mockRouter, ElTable, ElTableColumn],
            },
        });

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

        const wrapper = mount(TransactionsTable, {
            props: {
                displayData: {rows: transactionsMock},
                linkedColumns: ["transactionNumber"],
                isFetching: false,
            },
            global: {
                plugins: [mockRouter, ElTable, ElTableColumn],
            },
        });

        await wrapper.vm.$nextTick();

        const tableHeaderCells = wrapper.find("thead").findAll("th");
        expect(tableHeaderCells.length).toBe(Object.keys(displayData.rows[0]).length);
    });
});

