import TransactionsTable from "../../../components/transactions/TransactionsTable.vue";
import {mount} from "@vue/test-utils";
import {vi, test} from "vitest";
import {transactionsMock} from "../../mock/transaction";
import {ElTable, ElTableColumn} from "element-plus";
import {mockRouter} from "../../router.mock";

describe("TransactionsTable", () => {
    test("renders the correct number of columns", async () => {
        // const linkedColumns = ["transactionNumber", "memo"];
        //
        // const wrapper = mount(TransactionsTable, {
        //     props: {
        //         displayData: { rows: transactionsMock },
        //         linkedColumns: linkedColumns,
        //         isFetching: false,
        //     },
        //     global: {
        //         plugins: [mockRouter, ElTable, ElTableColumn],
        //     },
        // });
        //
        // await wrapper.vm.$nextTick();
        //
        // const tableHeaderCells = wrapper.find("thead").findAll("th");
        // expect(tableHeaderCells.length).toBe(Object.keys(transactionsMock[0]).length);
    });

    test("renders the correct number of columns with linked columns", async () => {
    });
    // const displayData = {
    //     rows: [
    //         { transactionNumber: "12345", date: "2023-01-01" },
    //         // Add other rows as needed
    //     ],
    // };
    //
    // const wrapper = mount(TransactionsTable, {
    //     props: {
    //         displayData: { rows: transactionsMock },
    //         linkedColumns: ["transactionNumber"],
    //         isFetching: false,
    //     },
    //     global: {
    //         plugins: [mockRouter, ElTable, ElTableColumn],
    //     },
    // });
    //
    // await wrapper.vm.$nextTick();
    //
    // const tableHeaderCells = wrapper.find("thead").findAll("th");
    // expect(tableHeaderCells.length).toBe(Object.keys(displayData.rows[0]).length);

});

